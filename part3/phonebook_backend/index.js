const express = require('express')
const morgan = require('morgan')
const  cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('this is the main page. Please go to /api/persons')
})

app.get('/api/persons', (req, res) =>{
    res.json(persons)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()
    const page = `<p>Phonebook has info for ${count} people</p>
    <p>${date.toString()}</p>`
    res.send(page)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const genID = () =>{
    const key = new Date().getMilliseconds()
    return key
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!(body && body.name && body.number)){
        if (!body){
            return res.status(400).json({
                error: "request is invalid. body not provided"
            })
        } else{
            return res.status(400).json({
                error: `${body.name? 'number': 'name'} must be provided` 
            })
        }
    }

    if (persons.filter(person => person.name === body.name).length) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        'id': `${genID()}`,
        'name': body.name,
        'number': body.number
    }

    persons = persons.concat(person)

    res.json(persons)    
})

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
console.log(`go to http://localhost:${PORT}`)