require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
const Person = require('./models/person')

morgan.token('person', function (req, response) { 
  return `${JSON.stringify(req.body)}` })



let mgn = morgan(':method :url :status - :response-time ms :req[header] :person')


const requestLogger = (request, response, next)=> {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('--------------------------------')
  next()
}

app.use(requestLogger)

app.use(mgn)



app.get('/info', (request, response) => {
    Person.countDocuments({}).then(x => {
      const fecha = new Date()
      response.send(`
      <p>Examen2 has info for ${x} people</p>
      <p>${fecha} </p>
      `)

    })
    .catch(error => {
      response.status(500).send('No se pudo encontrar')
    })
    
   
    
})


app.get('/api/personas',(request,response)=>{
    Person.find({}).then(persons=> {
    response.json(persons)
    })
})


app.get('/api/personas/:id', (request, response, next)=>{
     Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
    }
    else{
        response.status(404).send()
    }


     })

     .catch(error => next(error))
  
   
} )

app.delete('/api/personas/:id',(request,response)=>{
 Person.findByIdAndRemove(request.params.id)
 .then(result => {

  if (result !== null) {
    response.status(204).send()
  }
  else{
    response.status(404).send()
  }
 })
 .catch(error => {
  console.log(error)
  response.status(404).send()
 })
  
})



app.put('/api/personas/:id', (request, response)=>{
  
  const body = request.body;
  const personUpdate ={
     
      number : body.number
      
  }
   Person.findByIdAndUpdate(request.params.id,personUpdate,{new:true}).then(
    updatedPerson => {response.json(updatedPerson)}
   )

} )



const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(x => x.id))
      : 0
  return maxId + 1
}


app.post('/api/personas',(request, response) => {
  const body = request.body;

  if (!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.find({}).then(persons => {
    if(persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique '
      })
    }

    const person = new Person({
      name: body.name, 
      datebirth: body.datebirth
    })
    person.save().then(x => {
      response.json(x)
    })
  })


  
})
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
