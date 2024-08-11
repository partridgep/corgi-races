import { RaceTable } from "../../components/RaceTable"
// import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

export const HomePage = () => {

    const strongStr = "herding";

    type Coordinates = {
        latitude: number;
        longitude: number;
    }

    if (!navigator.geolocation) {
        alert("No geolocation available!");
      }

    const getUserLocation = (): Promise<Coordinates> => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords: Coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        resolve(coords);
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

    const queryClosestRaces = async () => {
        let userCoordinates: Coordinates | null = null;

        await getUserLocation().then((coords: Coordinates) => {
            console.log('User latitude:', coords.latitude);
            console.log('User longitude:', coords.longitude);
            userCoordinates = coords;
            const queryParams = {
                lat: userCoordinates.latitude.toString(),
                lon: userCoordinates.longitude.toString(),
                num: "5",
                startTime: new Date().toISOString(),
            }
            let query = `/api/races?${new URLSearchParams(queryParams as Record<string, string>).toString()}`;
            console.log(query);
            axios.get(query)
            .then(res => res.data)
            .then(data => {
                console.log(data);
            });
        })
        .catch(error => {
            console.error('Error getting user location:', error.message);
            return;
        });
    }

    return (
        <div className="w-full pb-28">
            <h1 className="w-full dark:text-white text-8xl font-bold text-center mt-40">Corgi Races</h1>
            <h2 className="w-full subtitle text-5xl text-center mt-12 mb-4"><span className="short-animate">Short</span> nubby legs</h2>
            <h2 className="w-full subtitle text-5xl text-center my-4">
                <span className="leftOfLong-animate">+ </span>
                <span className="mx-2 relative long-animate">long</span>
                <span className="rightOfLong-animate"> potato bodies</span>
            </h2>
            <h2 className="w-full subtitle text-5xl text-center my-4">+ strong
            <span className="mx-2 strong-animate">
                {strongStr.split("").map(function(char, index) {
                    const style = { animationDelay: (0.1 + index / 10) + "s" };
                    return <span
                        aria-hidden="true"
                        key={index}
                        className="strong-animate"
                        style={style}
                    >
                        {char}
                    </span>;
                })}
            </span>
                 energy</h2>
            <h2 className="w-full subtitle text-semibold text-5xl text-center mt-4 mb-16">= a recipe for a hilarious competition</h2>
            <div className="w-full mx-auto mt-6 mb-12 text-center">
                <button
                    type="button"
                    onClick={queryClosestRaces}
                    className="rounded-full bg-indigo-600 mx-auto px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Find nearest corgi race
                </button>
            </div>
            <p className="w-full dark:text-gray-200 text-center italic mb-4 text-sm">Upcoming races</p>
            <div className="px-2 sm:px-4 md:px-20">
                <RaceTable num={10} startTime={new Date()} asc={true} />
            </div>
        </div>
    )
}