import { useState, useEffect } from 'react'
import personsService from "./services/persons";

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

const Persons = ({ filteredPerson, deleteHandler }) => {
  return (
    filteredPerson.map((person) => {
      return (
        <PersonDetail key={person.id} person={person} deleteHandler={() => { deleteHandler({ id: person.id, name: person.name, }) }} />
      )
    })
  )
}

const PersonDetail = ({ person, deleteHandler }) => {
  return (
    <div>
      {person.name} {person.number} &nbsp;
      <button onClick={deleteHandler}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find((person) => person.name === newName)) {

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one ?`)) {
        const person = persons.filter((person) => person.name === newName)[0]
        personsService
          .update(person.id, { name: newName, number: newNumber })
          .then(response => {
            setPersons(persons.map(person => person.name !== newName ? person : response))
            setNewName('')
            setNewNumber('')
          })
      } else {
        alert(`Add ${newName} canceled`)
        setNewName('')
        setNewNumber('')
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      // id: persons.length + 1
    }

    personsService
      .add(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewNumber('')
        setNewName('')
      })

  }

  const deletePerson = ({ id, name }) => {
    if (window.confirm(`delete user ${name} `)) {
      personsService
        .deletePerson(id)
        .then(deleteResponse => {
          alert('Delete Success')
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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

      <Persons filteredPerson={filteredPerson} deleteHandler={deletePerson} />
    </div>
  )
}

export default App