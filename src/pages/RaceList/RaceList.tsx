import { RaceTable } from '../../components/RaceTable';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { QueryParams } from '../../types';

export const RaceList = () => {

    let [ searchParams ] = useSearchParams();

    const [query, setQuery] = useState<QueryParams>({});

    type Coordinates = {
        latitude: number;
        longitude: number;
    }

    if (!navigator.geolocation) {
        alert("No geolocation available!");
      }

    useEffect(() => {

        const updateQueryParams = async () => {
            // Convert searchParams to an object
            const params = Object.fromEntries([...searchParams]);
            console.log(params)
    
            let userCoordinates: Coordinates | null = null;
    
            if (params.closest) {
                userCoordinates = await getUserLocation();
            }
            else if (parseFloat(params.longitude) && parseFloat(params.latitude)) {
                userCoordinates = {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude)
                } 
            }
    
            // Construct the query based on the params
            let queryParams: QueryParams = {
                id: params.id,
                num: params.num ? Number(params.num) : undefined,
                startTime: params.startTime ? new Date(params.startTime) : undefined,
                endTime: params.endTime ? new Date(params.endTime) : undefined,
                asc: params.asc ? params.asc === 'true' : undefined,
            }
            if (userCoordinates) {
                queryParams.latitude = userCoordinates.latitude
                queryParams.longitude = userCoordinates.longitude
            }

            console.log("new query", query)
    
            // set the items whenever searchParams change
            setQuery(queryParams);
        }

        // Call the async function
        updateQueryParams();
    }, [searchParams]); // Dependency array with searchParams

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

    return (
        <div className='p-4'>
            <h1 className='text-lg font-semibold dark:text-white'>Corgi Races Search</h1>
            <div className="px-2 sm:px-4 md:px-20">
                <RaceTable query={query} />
            </div>
        </div>
    )
}