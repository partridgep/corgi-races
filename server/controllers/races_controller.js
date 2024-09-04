const races = require('express').Router()
const { where } = require('sequelize')
const db = require('../models')
const { Race } = db
const { Op } = require('sequelize')
const Sequelize = require('sequelize');

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
        const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1
        let userLat, userLon

        // get user geolocation if requested and permitted
        if (req.query.latitude && req.query.longitude) {
            userLat = parseFloat(req.query.latitude)
            userLon = parseFloat(req.query.longitude)
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
        
        let orderClause = [
            ['datetime', req.query.asc === "true" ? 'ASC' : 'DESC'],
        ];

        // Calculate distance only if user's latitude and longitude are provided
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
                offset: (page - 1) * limit,
                where: whereClause,
            },
        )
        const totalRecords = await Race.count({
            where: whereClause
        })
        const totalPages = Math.ceil(totalRecords / limit);

        res.status(200).json({
            results: foundRaces,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalPages: totalPages,
                totalRecords: totalRecords
            },
            order_by: orderClause
        })
    } catch (error) {
        res.status(500).send("Server error")
        console.log(error)
    }
})

module.exports = races