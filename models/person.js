const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(url);

console.log('connecting to', url)

// Mongoose's setting 'useUnifiedTopology: true' is needed to avoid use of
// deprecated 'server discovery and monitoring engine' and a warning message
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error on connection: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Modify id-field from object to string and delete
// needles __v -field
personSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)