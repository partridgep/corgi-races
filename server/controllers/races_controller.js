const races = require('express').Router()
const { where } = require('sequelize')
const db = require('../models')
const { Race } = db
const { Op } = require('sequelize')

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

// GET RACES QUERY
races.get("/query", async (req, res) => {
    try {
        const limit = parseInt(req.query.num)

        // construct where clause
        let whereClause = {}
        if (req.query.id) whereClause.race_id = req.query.id
        // If startTime and endTime are provided, add them to the where clause
        if (req.query.startTime && req.query.endTime) {
            whereClause.datetime = {
                [Op.between]: [new Date(req.query.startTime), new Date(req.query.endTime)]
            }
        } else if (req.query.startTime) {
            whereClause.datetime = {
                [Op.gte]: new Date(req.query.startTime)
            }
        } else if (req.query.endTime) {
            whereClause.datetime = {
                [Op.lte]: new Date(req.query.endTime)
            }
        }

        const foundRaces = await Race.findAll(
            {
                order: [
                    ['datetime', req.query.asc === "true" ? 'ASC': 'DESC']
                ],
                limit: !isNaN(limit) ? limit : null,
                where: whereClause,
            },
        )
        res.status(200).json(foundRaces)
    } catch (error) {
        res.status(500).send("Server error")
        console.log(error)
    }
})

module.exports = races