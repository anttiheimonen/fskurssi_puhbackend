const mongoose = require('mongoose')

// Program prints list of people from phonebook or adds a new person's info.
// Argument array contains [2] password, [3] person's name,
// [4] phone number.
if ( process.argv.length != 3 && process.argv.length != 5 ) {
  console.log('Ohje:')
  console.log('node mongo.js salasana --Tulostaa puhelinluettelon henkilöt');
  console.log('node mongo.js salasana nimi puhelinnumero -- Lisää uuden henkilön puhelinluetteloon');

  process.exit(1)
}
const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-smu7a.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Add a new person to database
if (process.argv.length == 5){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(response => {
    console.log('Lisätty')
    mongoose.connection.close()
  })
}

// Get a list of people from database
if (process.argv.length == 3){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}