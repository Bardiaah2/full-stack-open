import { useState, useEffect } from 'react'
import backend from './backend'
import './index.css'


const Filter = ({ shownValue, handleChangeFilter }) => {
  return <div>filet shown with <input value={shownValue} onChange={handleChangeFilter}/></div>
}

const PersonForm = ({ nameValue, numberValue, nameOnChnage, numberOnChange , handleSubmit}) => {
  return(
    <form onSubmit={handleSubmit}>
        <div>
          name: <input value={nameValue} onChange={nameOnChnage} required/>
        </div>
        <div>
          number: <input value={numberValue} onChange={numberOnChange} required/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ shown, handleRemove }) => {
  return shown.map( (person) => {
    return (
      <div key={person.id}>
        <p key={person.id}>
          {person.name} {person.number}
          <button key={person.name} onClick={() => handleRemove(person)}>delete</button>
        </p>
      </div>
    )
    })
}

const Notification = ({ message, category }) => {
  if (message === '') {
    return null
  }

  return (
    <div className={category}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [shown, setShown] = useState(persons)
  const [shownValue, setShownValue] = useState('')
  const [message, setMessage] = useState({data: '', category: ''})

  const getPersons = () =>{
    const persons = backend.getAll().then(response =>{
      setPersons(response)
      setShown(response)
    }
    )
  }
  useEffect(getPersons, [])

  const handleChangeFilter = (event) => {
    event.preventDefault()
    const value = event.target.value.toLowerCase()
    setShownValue(value)
    setShown(persons.filter((person) => {
      const name = person.name.toLowerCase()
      return name.indexOf(value) != -1
    }))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    var flag = false
    const newPerson = {name: newName, number: newNumber}
    const newPersons = [...persons, newPerson]

    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];
      if (person.name == newName) {
          if (confirm(newName+'is already added to phonebook, replace the old number with the new one?')) {
            newPerson.id = person.id
            flag = true
          } else return
        }
    }
  
    if (flag) {
      backend.update(newPerson.id, newPerson).then(() => {
        getPersons()
        setNewNumber('')
        setNewName('')
        setMessage({data: 'Changed '+newPerson.name, category:'changed'})
      })
    }else {
      backend.create(newPerson).then(() =>{
        getPersons()
        setNewNumber('')
        setNewName('')
        setMessage({data: 'Added '+newPerson.name, category:'added'})
      })
    }
  }
  const handleChangeName = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }
  const handleChangeNumber = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }
  const handleRemove = (person) => {
    if (confirm('Delete '+person.name)) {
      backend.remove(person.id)
      .then(()=> getPersons())
      .catch(()=> setMessage({data: 'Information of '+person.name+' has already been removed from sertver',
        category: 'error'
      }))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.data} category={message.category}/>
      <Filter shownValue={shownValue} handleChangeFilter={handleChangeFilter} />
      <h2>add a new</h2>
      <PersonForm 
        nameValue={newName} nameOnChnage={handleChangeName}
        numberValue={newNumber} numberOnChange={handleChangeNumber}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons shown={shown} handleRemove={handleRemove}/>
    </div>
  )
}

export default App