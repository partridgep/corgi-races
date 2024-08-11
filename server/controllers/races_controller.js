const races = require('express').Router()
const { where } = require('sequelize')
const db = require('../models')
const { Race } = db
const { Op } = require('sequelize')
const { getUserLocation } = require('../services/locationServices')

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
        let userLat, userLon

        // get user geolocation if requested and permitted
        if (req.query.lat && req.query.lon) {
            userLat = parseFloat(req.query.lat)
            userLon = parseFloat(req.query.lon)
        }

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

        // Calculate distance only if user's latitude and longitude are provided
        let orderClause = [
            ['datetime', req.query.asc === "true" ? 'ASC' : 'DESC'],
        ];

        if (!isNaN(userLat) && !isNaN(userLon)) {
            orderClause.unshift([
                Sequelize.literal(`
                    earth_distance(
                        ll_to_earth(${userLat}, ${userLon}),
                        ll_to_earth("Race"."latitude", "Race"."longitude")
                    )
                `),
                'ASC',
            ]);
        }

        const foundRaces = await Race.findAll(
            {
                order: orderClause,
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