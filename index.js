require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

// Create morgan token that contains request body
morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'))

let people = [
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

// Get json-object of all people
app.get('/api/people', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.json(people)
    })
    .catch( error => next(error))
})

// Get info of single person
app.get('/api/people/:id', (req, res, next) => {
  // Find person with given id
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person.toJSON())
      } else  {
        res.status(404).end()
      }
    })
    .catch( error => next(error))
})

// Delete single person
app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch( error => next(error))
})

// Add a new person
app.post('/api/people', (req, res, next) => {
  const newPerson = Object.assign({}, req.body)


  // Checking of neccessary data. This could be a different function
  if (newPerson.name === undefined || newPerson.name.trim() === "" ) {
    return res.status(400).json({
      error: 'Person must have a name'
    })
  }

  // Check for a dublicate name
  if (people.findIndex(per => per.name === newPerson.name ) >= 0) {
    return res.status(400).json({
      error: 'Name of the person already exists in the phonebook. Name must be unique'
    })
  }

  if (newPerson.number === undefined || newPerson.number.trim() === "") {
    return res.status(400).json({
      error: 'Person must have a number'
    })
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch( error => next(error))
})

// Update person's number
app.put('/api/people/:id', (req, res, next) => {
  const person = {
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch( error => next(error))
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${people.length} people</p>` +
           `<p>${new Date()}</p>`
  )
})

// Handle requests to unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'endpoint not known' })
}

app.use(unknownEndpoint)

// Handle error's in requests
const errorHandler = (error, request, response, next) => {
  console.log(`Error: ${error.message}`)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`${new Date()}: Server running on port ${PORT}`)
})