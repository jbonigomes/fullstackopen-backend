const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')

const port = 3000
const app = express()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  }
]

app.use(morgan('tiny'))
app.use(bodyParser.json())

app.get('/info', (req, res) => {
  const line1 = `<p>Phonebook has info for ${persons.length} people</p>`
  const line2 = `<p>${new Date()}</p>`

  res.send(`<div>${line1}${line2}<div>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id === +req.params.id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id !== +req.params.id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const clean = (str) => str.toLowerCase().trim()

  if (!req.body.name) {
    res.status(400).json({
      error: 'name is mandatory',
    })
  } else if (!req.body.number) {
    res.status(400).json({
      error: 'number is mandatory',
    })
  } else if (persons.find((p) => clean(p.name) === clean(req.body.name))) {
    res.status(400).json({
      error: 'name must be unique',
    })
  } else {
    const person = {
      name: req.body.name,
      number: req.body.number,
      id: Math.floor(Math.random() * Math.floor(1000)),
    }

    persons = persons.concat(person)

    res.json(person)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
