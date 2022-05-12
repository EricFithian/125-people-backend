// DEPENDENCIES

// get access to .env variables
require('dotenv').config();

// pull PORT from .env, set default value to 3000
const { PORT = 3000, MONGODB_URL } = process.env;

// import express
const express = require('express');

// create application object
const app = express();

// import mongoose
const mongoose = require('mongoose');

// import middleware
const cors = require('cors');
const morgan = require('morgan');

// CONNECTING TO DATABASE
mongoose.connect(MONGODB_URL);

// connecting events
mongoose.connection
.on('open', () => console.log('you are connected!'))
.on('close', () => console.log('you are disconnected!'))
.on('error', (error) => console.log(error))

// MODELS
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model('People', PeopleSchema);

// MIDDLEWARE
app.use(cors()) // to prevent cors errors, open access to all origins
app.use(morgan('dev')) // logging http responses
app.use(express.json()) // parsing json objects

// ROUTES

// create a test router
app.get('/', (req, res) => {
    res.send('hello world!');
});

// get people route
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
})

// create people route
app.post('/people', async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error);
    }
})

// update people route
app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error);
    }
})

// delete people route
app.delete('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
})

// LISTENER

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));