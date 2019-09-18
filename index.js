const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  // Find person with given id number
  const person = persons.find(person => person.id === id)
  // If person found, return it. Otherwise return status 404
  person !== undefined ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  // Filter out the person with given id
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  console.log("POST request - Add a new person")
  const newPerson = req.body

  // Checking of neccessary data. This could be a different function
  if (newPerson.name === undefined) {
    console.log('Error: Name missing');

    return res.status(400).json({
      error: 'Person must have a name'
    })
  }

  // Check for a dublicate name
  if (persons.findIndex(per => per.name === newPerson.name ) >= 0) {
    console.log('Error: Name is a dublicate');
    return res.status(400).json({
      error: 'Persons name already exists in the phonebook. Name must be unique'
    })
  }

  if (newPerson.number === undefined) {
    console.log('Error: Number missing');
    return res.status(400).json({
      error: 'Person must have a number'
    })
  }

  // Random id number for new person. For now it can be same as
  // existing persons's id number.
  newPerson.id = Math.floor(Math.random() * Math.floor(10000))
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

app.get('/info', (req, res) => {
  console.log(`requested /info`)
  res.send(`<p>Phonebook has info for ${persons.length} people</p>` +
           `<p>${new Date()}</p>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`${new Date()}: Server running on port ${PORT}`)
})