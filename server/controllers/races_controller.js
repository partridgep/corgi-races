const races = require('express').Router()
const db = require('../models')
const { Race } = db

// GET ALL RACES
races.get("/", async (req, res) => {
    try {
        const foundRaces = await Race.findAll()
        console.log(foundRaces)
        res.status(200).json(foundRaces)
    } catch (error) {
        res.status(500).send("Server error")
        console.log(error)
    }
})

module.exports = races