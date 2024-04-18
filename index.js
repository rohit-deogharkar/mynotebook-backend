const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')

app.use(express.json())
app.use(cors())

const connectToMongo = require('./db')
connectToMongo()

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (res, req)=>
    res.send('hello world')
)

app.listen(port, ()=>{
    console.log(`Runing on http://localhost:${port}`)
})