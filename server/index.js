const express =require("express")
const cors= require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const AuthRout = require("./routes/auth")
const EventRout = require("./routes/event")
const BookingRout = require("./routes/booking")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

//Router
app.use('/api/auth',AuthRout)
app.use('/api/events',EventRout)
app.use('/api/bookings',BookingRout)



const PORT =5000
app.listen(PORT,()=>{
    console.log(`Your server is running on ${PORT}`);  
})

//Coneect Db
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("🟢Connected to DB");
    
}).catch((err) => {
    console.log("🔴DisConnected to DB:",err);
});