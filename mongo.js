const mongoose = require('mongoose')
const password = process.argv[2]
const name = process.argv[3]
const datebirth = process.argv[4]

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}




const url =`mongodb+srv://Caro:${password}@cluster0.r298rmv.mongodb.net/app-datospersonas?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  datebirth: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3 ){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    }).mongoose.connection.close()
  })
}

if (process.argv.length > 3 ){
  const person = new Person({
    name: name,
    datebirth: datebirth
  })

  person.save().then(() => {
    console.log(`added ${name} date birth ${datebirth} to examen2`)
    mongoose.connection.close()
  })
}
