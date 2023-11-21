const express = require('express')
const mongoose= require('mongoose')
const cors=require('cors')
const studentsRouter =require('./routers/studentsRouter')


const app = express()

app.use(cors({
    origin:"*",
    methods:"*",
    allowedHeaders:"*",
    exposedHeaders:"*"
}))

app.use(express.json())
app.use('/students',studentsRouter)

const connectToDbAndStart=async ()=>{
    await mongoose.connect('mongodb+srv://knockoutkeerthe:4QMFhjVa3St8Mynr@cluster0.mwbdwgm.mongodb.net/students-courses-App?retryWrites=true&w=majority');
    console.log("connected to Mongo Db");
    app.listen(8000);
}

connectToDbAndStart()