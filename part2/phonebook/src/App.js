import { useState } from 'react'

const Filter = ({ filter, handler }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handler} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, inputNameHandler, inputNumberHandler, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={inputNameHandler} />
      </div>
      <div>
        number: <input value={newNumber} onChange={inputNumberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filteredPerson }) => {
  return (
    filteredPerson.map((person) => {
      return (
        <PersonDetail key={person.id} person={person} />
      )
    })
  )
}

const PersonDetail = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return false
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(newPerson))
    setNewNumber('')
    setNewName('')
  }

  const inputNameHandler = (event) => {
    setNewName(event.target.value)
  }

  const inputNumberHandler = (event) => {
    setNewNumber(event.target.value)
  }

  const inputFilterHandler = (event) => {
    setFilter(event.target.value)
  }

  const filteredPerson = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handler={inputFilterHandler} />

      <h3>Add a new</h3>

      <PersonForm addPerson={addPerson} newName={newName}
        newNumber={newNumber} inputNameHandler={inputNameHandler}
        inputNumberHandler={inputNumberHandler} />


      <h3>Numbers</h3>

      <Persons filteredPerson={filteredPerson} />
    </div>
  )
}

export default App