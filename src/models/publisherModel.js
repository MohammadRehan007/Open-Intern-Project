const mongoose=require('mongoose')

const publisherSchema=new mongoose.Schema({
    
    name:String,
    headQuater: String
}, { timestamps: true })

module.exports=mongoose.model('myPublisher',publisherSchema)