const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
// const MongoStore = require('connect-mongo')(session)
const logger = require('morgan')
const connectDB = require('./config/database')
const userRoutes = require('./routes/user')
const exchangesRoutes = require('./routes/exchanges')
// const idRoutes = require('./routes/ids')

require('dotenv').config({path: './config/.env'})
connectDB()

// const bodyParser = require('body-parser');            
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(logger('dev'));
app.use(cors())
app.use('/', userRoutes)
app.use('/exchanges', exchangesRoutes)

 
// app.use('/plants', plantRoutes)
// app.use('/id', idRoutes)
 
app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running, you better catch it!')
})   