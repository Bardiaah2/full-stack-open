require('dotenv').config()
const express = require('express')
const Person = require('./mongo')

const app = express()

app.use(express.json())

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('this is the main page. Please go to /api/persons')
})

app.get('/api/persons', (req, res) =>{
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
})

app.put('/api/persons/:id', (req, res) => {
  const {name, number} = req.body
  console.log(name, number, req.params.id)

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      person.number = number
      return person.save().then(savedPerson => {
        res.json(savedPerson)
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.deleteOne({_id: `${req.params.id}`}).then(
    res.status(204).end()
  )
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!(body && body.name && body.number)){
    if (!body){
      return res.status(400).json({
        error: 'request is invalid. body not provided'
      })
    } else{
      return res.status(400).json({
        error: `${body.name? 'number': 'name'} must be provided` 
      })
    }
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson =>{
    res.json(savedPerson)
  }
  )
})


const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
  console.log(`go to http://localhost:${PORT}`)
})