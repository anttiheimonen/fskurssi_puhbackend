const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log(url)

console.log('connecting to', url)

// Mongoose's setting 'useUnifiedTopology: true' is needed to avoid use of
// deprecated 'server discovery and monitoring engine' and a warning message
mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error on connection: ', error.message)
  })

// Validation rules
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  },
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

personSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Person', personSchema)