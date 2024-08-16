import axios from "axios";

export function getUserLocation() {
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
};

export async function getUserZipCode(coords) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.address && data.address.postcode) {
            return data.address.postcode;
        } else {
            console.error("ZIP code not found in response.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching ZIP code:", error);
        return null;
    }
}

export async function getCoordinatesFromZipCode(zipCode) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${zipCode}&countrycodes=us`;

    try {
        const response = await fetch(url);
        console.log(response)
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
            console.error("Coordinates not found for the provided ZIP code.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates from ZIP code:", error);
        return null;
    }
}
