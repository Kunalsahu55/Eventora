const express = require("express")
const router = express.Router()
const {protect ,admin} = require("../middleware/auth")
const {getEvents,getEventById,createEvent,updateEvent,deleteEvent}= require("../controllers/eventController")

//get All events
 router.get('/',getEvents)

 //get Event by id
 router.get('/:id',getEventById)

 //create Event (Only Admin)
 router.post('/',protect,admin,createEvent)

 //Update Event
 router.put('/:id',protect,admin,updateEvent)

 //Delete event
 router.delete('/:id',protect,admin,deleteEvent)

 module.exports =router