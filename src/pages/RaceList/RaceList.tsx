import { RaceTable } from '../../components/RaceTable';
import PaginationButton from '../../components/PaginationButton';
import { ZipCodeInput } from '../../components/ZipCodeInput';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from "react-router-dom";
import { QueryParams, UrlParams, Coordinates } from '../../types';
import { getUserZipCode, getCoordinatesFromZipCode } from '../../services/locationServices';
import useUserLocation from '../../hooks/useUserLocation';

export const RaceList = () => {

    const globalUserCoordinates = useUserLocation();

    let [ searchParams, setSearchParams ] = useSearchParams();

    const [state, setState] = useState({
        query: {} as QueryParams,
        urlParams: {} as UrlParams,
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalRecords: 0,
        },
        geolocating: false,
        isQueryReady: false,
        zipCode: '',
        cachedCoordinates: null as Coordinates | null,
    });

    const getUserLocation = useCallback(async (): Promise<Coordinates | null>  => {

        if (state.cachedCoordinates) {
            return state.cachedCoordinates;
        }

        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords: Coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        setState(prevState => ({ ...prevState, cachedCoordinates: coords }));
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
    }, [state.cachedCoordinates]);


    const updateZIPCode = useCallback(
        async (userCoordinates: Coordinates) => {
            const zipCode = await getUserZipCode(userCoordinates);
            setState(prevState => ({ ...prevState, zipCode }));
        }, [] 
    );

    const handleZipCodeUpdate = async (newZipCode: string) => {
        setState(prevState => ({ ...prevState, zipCode: newZipCode }));
        const newCoordinates = await getCoordinatesFromZipCode(newZipCode);
        // console.log(newCoordinates);

        let newParams = { ...state.urlParams };
        delete newParams.closest;
        newParams.longitude = newCoordinates?.longitude;
        newParams.latitude = newCoordinates?.latitude;

        // Convert all values to strings
        const stringParams: Record<string, string> = {};
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined) {
                stringParams[key] = String(value);
            }
        });

        // update URL params for longitude & latitude
        setSearchParams(stringParams)
    };

    const handlePaginationData = (pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
      }) => {

        console.log("new pagination from query", pagination)
        console.log("URLParams", state.urlParams)

        setState(prevState => ({ ...prevState, pagination }));

        if (pagination.currentPage !== state.urlParams.page || pagination.pageSize !== state.urlParams.num) {
            console.log("update URL page and num")
            
            let newParams = { ...state.urlParams };
            newParams.page = pagination.currentPage;
            newParams.num = pagination.pageSize;

            // Convert all values to strings
            const stringParams: Record<string, string> = {};
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined) {
                    stringParams[key] = String(value);
                }
            });

            // update URL params
            setSearchParams(stringParams)

        }

        
    };

    const handlePageNumberChange = (currentPage: number) => {
        if (currentPage !== state.urlParams.page) {
            console.log("update URL page")
            
            let newParams = { ...state.urlParams };
            newParams.page = currentPage;

            // Convert all values to strings
            const stringParams: Record<string, string> = {};
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined) {
                    stringParams[key] = String(value);
                }
            });

            // update URL params
            setSearchParams(stringParams)

        }
    };

    useEffect(() => {

        const updateQueryParams = async () => {
            const params = Object.fromEntries([...searchParams]);

            // Initialize a new object for the updated URL parameters
            let newUrlParams: UrlParams = { ...state.urlParams };

            for (let [key, value] of Object.entries(params)) {
                // Convert `num` and `page` to integers
                if (key === "num") {
                    newUrlParams.num = parseInt(value);
                } else if (key === "page") {
                    newUrlParams.page = parseInt(value);
                } else {
                    // For other keys, retain the string value
                    (newUrlParams as any)[key] = value;
                }
            }

            // Avoid updating state if params have not changed
            setState(prevState => {
                if (JSON.stringify(newUrlParams) === JSON.stringify(prevState.urlParams)) {
                    return prevState; // No need to update state if params are the same
                }
                console.log("setting url params in hook", newUrlParams)
                return { ...prevState, urlParams: newUrlParams };
            });
    
            let userCoordinates: Coordinates | null = null;
            let needsGeolocation = false;
    
            if (params.closest) {
                needsGeolocation = true;
                setState(prevState => ({ ...prevState, geolocating: true }));
                try {
                    if (globalUserCoordinates) userCoordinates = globalUserCoordinates;
                    else userCoordinates = await getUserLocation();
                } catch (error) {
                    console.error(error);
                } finally {
                    setState(prevState => ({ ...prevState, geolocating: false }));
                }
            }
            else if (parseFloat(params.longitude) && parseFloat(params.latitude)) {
                needsGeolocation = true;
                userCoordinates = {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude)
                }
            }

            if (needsGeolocation && userCoordinates !== null) {
                updateZIPCode(userCoordinates)
            }
    
            // Construct the query based on the params
            let queryParams: QueryParams = {
                id: params.id,
                num: params.num ? Number(params.num) : undefined,
                page: params.page ? Number(params.page) : 1,
                startTime: params.startTime ? new Date(params.startTime).toISOString() : undefined,
                endTime: params.endTime ? new Date(params.endTime).toISOString() : undefined,
                asc: params.asc ? params.asc === 'true' : undefined,
            }
            if (userCoordinates) {
                queryParams.latitude = userCoordinates.latitude
                queryParams.longitude = userCoordinates.longitude
            }
    
            if (JSON.stringify(queryParams) !== JSON.stringify(state.query)) {
                console.log("setting query state!")
                setState(prevState => ({
                    ...prevState,
                    query: queryParams,
                    isQueryReady: !needsGeolocation || !!userCoordinates,
                }));
            }
            else console.log("do not change state")
        }

        // Call the async function
        updateQueryParams();
    }, [searchParams, globalUserCoordinates]);

    return (
        <div className="px-2 sm:px-4 md:px-20">
            <h1 className="text-lg font-semibold dark:text-white py-4">Corgi races locator</h1>
            <div className='mt-2 mb-6'>
                <ZipCodeInput zipCode={state.zipCode} onZipCodeChange={handleZipCodeUpdate} />
            </div>
            <RaceTable
                query={state.query}
                geolocating={state.geolocating}
                isQueryReady={state.isQueryReady}
                onPaginationData={handlePaginationData}
            />
            <div className='mt-6'>
                <PaginationButton
                    page={state.query.page || 1}
                    count={state.query.num || 5}
                    total={state.pagination.totalRecords}
                    noFurtherPages={ state.pagination.currentPage >= state.pagination.totalPages }
                    changePageNumber={handlePageNumberChange}
                />
            </div>
        </div>
    )
}