const {Schema,model}=require('mongoose')

const studentSchema =new Schema({
    username:String,
    passwordHash:String
})

const studentModel = model('students',studentSchema)

module.exports = studentModel