const axios = require('axios');
const db = require('../models');
const { Race } = db;

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                error => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true, // Use GPS if available
                    timeout: 10000, // Wait 10 seconds before timing out
                    maximumAge: 0 // Do not use a cached position
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

async function geocodeAddress(address, city, state) {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = {
        street: address,
        city: city,
        state: state,
        format: 'json',
    };
    try {
        const response = await axios.get(url, {
            params,
            headers: {
                'User-Agent': 'CorgiRaceTracker/1.0 (paul.partridg@gmail.com)',
            },
        });
        console.log(response)
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
            };
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error geocoding address:', error.message);
        throw error;
    }
}

// ADD COORDINATES FOR EACH RACE
async function updateRaceCoordinates() {
    // Fetch all races that do not have latitude and longitude
    const races = await Race.findAll({
        where: {
            latitude: null,
            longitude: null
        }
    });

    let numUpdates = races.length;

    console.log(`${races.length} race${races.length === 1 ? '' : 's'} to update...`)

    if (numUpdates) {
        for (const race of races) {
            const coords = await geocodeAddress(race.address, race.city, race.state);
            if (coords) {
                await race.update({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                console.log(`Updated coordinates for race at ${race.address}`);
            } else {
                console.warn(`Failed to geocode address for race at ${race.address}`);
            }
        }
    
        console.log('Finished updating race coordinates.');
    }
}


module.exports = {
    getUserLocation,
    geocodeAddress,
    updateRaceCoordinates
};
