const  mongoose = require('mongoose')


const connectDB = async () => {
    try{
        const connection  = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true
        })
        console.log("MongoDB connected : "+ connection.connection.host)
    }
    catch(err){
        console.log("Error: " +err.message)
        process.exit()
    }
}


module.exports = connectDB