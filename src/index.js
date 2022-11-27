const express = require('express');
var bodyParser = require('body-parser');
let multer = require('multer')
const route = require('./routes/route.js');

const app = express();
app.use(multer().any())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Divyajeetkumar:12345@project1.rxkr5ev.mongodb.net/test", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
});