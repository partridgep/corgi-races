import { RaceTable } from '../../components/RaceTable';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from "react-router-dom";
import { QueryParams } from '../../types';

export const RaceList = () => {

    let [ searchParams ] = useSearchParams();

    const [query, setQuery] = useState<QueryParams>({});
    const [geolocating, setGeolocating] = useState(false);
    const [isQueryReady, setIsQueryReady] = useState(false);

    type Coordinates = {
        latitude: number;
        longitude: number;
    }

    if (!navigator.geolocation) {
        alert("No geolocation available!");
      }

    const getUserLocation = useCallback((): Promise<Coordinates> => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords: Coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        resolve(coords);
                    },
                    error => {
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }, []); // Empty dependency array

    useEffect(() => {

        const updateQueryParams = async () => {
            const params = Object.fromEntries([...searchParams]);
            console.log(params)
    
            let userCoordinates: Coordinates | null = null;
            let needsGeolocation = false;
    
            if (params.closest) {
                needsGeolocation = true;
                setGeolocating(true)
                try {
                    userCoordinates = await getUserLocation();
                } catch (error) {
                    console.error(error);
                } finally {
                    setGeolocating(false);
                }
            }
            else if (parseFloat(params.longitude) && parseFloat(params.latitude)) {
                needsGeolocation = true;
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

            console.log("new query", queryParams)
    
            // set the items whenever searchParams change
            setQuery(queryParams);
            setIsQueryReady(!needsGeolocation || !!userCoordinates);
        }

        // Call the async function
        updateQueryParams();
    }, [searchParams, getUserLocation]); // Dependency array with searchParams

    return (
        <div className="px-2 sm:px-4 md:px-20">
            <h1 className="text-lg font-semibold dark:text-white py-4">Corgi races locator</h1>
            <RaceTable query={query} geolocating={geolocating} isQueryReady={isQueryReady} />
        </div>
    )
}