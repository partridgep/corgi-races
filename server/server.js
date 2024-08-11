// DEPENDENCIES
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const path = require('path');
const cors = require('cors');
const { updateRaceCoordinates } = require('./services/locationServices');

// CONFIGURATION / MIDDLEWARE
require('dotenv').config({ path: '../.env' });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));

// CONTROLLERS
const racesController = require('./controllers/races_controller');
app.use('/api/races', racesController);

// Call the coordinates updating function on server startup
updateRaceCoordinates()
    .then(() => console.log('Race coordinates updated'))
    .catch(err => console.error('Failed to update race coordinates', err));

// LISTEN
app.listen(3001, () => {
    console.log("Listening on port 3001");
})