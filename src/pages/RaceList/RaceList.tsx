import { RaceTable } from '../../components/RaceTable';
import PaginationButton from '../../components/PaginationButton';
import { ZipCodeInput } from '../../components/ZipCodeInput';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import { QueryParams, UrlParams, Coordinates, Pagination } from '../../types';
import { getUserZipCode, getCoordinatesFromZipCode } from '../../services/locationServices';
import useUserLocation from '../../hooks/useUserLocation';
import ItemsPerPage from '../../components/ItemsPerPage';

export const RaceList = () => {

    const globalUserCoordinates = useUserLocation();

    let [ searchParams, setSearchParams ] = useSearchParams();

    const [state, setState] = useState({
        // query: {} as QueryParams,
        // urlParams: {} as UrlParams,
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalRecords: 0,
        } as Pagination,
        geolocating: false,
        geolocationFailed: false,
        isQueryReady: false,
        zipCode: '',
    });

    const refs = useRef({
        query: {} as QueryParams,
        urlParams: {} as UrlParams,
        cachedCoordinates: null as Coordinates | null,
    });

    const getUserLocation = useCallback(async (): Promise<Coordinates | null>  => {

        if (refs.current.cachedCoordinates) {
            return refs.current.cachedCoordinates;
        }

        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords: Coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        refs.current.cachedCoordinates = coords; // Cache the coordinates
                        resolve(coords);
                    },
                    error => {
                        reject(error);
                        console.log("reject 1")
                        // add warning to frontend
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                console.log("reject 2")
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    }, []);


    const updateZIPCode = useCallback(
        async (userCoordinates: Coordinates) => {
            const zipCode = await getUserZipCode(userCoordinates);
            setState(prevState => ({
                ...prevState,
                zipCode,
            }));
        }, []
    );

    const handleZipCodeUpdate = useCallback( async (newZipCode: string) => {
        console.log("handleZipCodeUpdate")
        setState(prevState => ({
            ...prevState,
            zipCode: newZipCode,
            pagination: {
                ...prevState.pagination,
                currentPage: 1,
            },
        }));
        const newCoordinates = await getCoordinatesFromZipCode(newZipCode);
        // console.log(newCoordinates);

        let newParams = { ...refs.current.urlParams };
        delete newParams.closest;
        newParams.longitude = newCoordinates?.longitude;
        newParams.latitude = newCoordinates?.latitude;
        newParams.page = 1;

        // Convert all values to strings
        const stringParams: Record<string, string> = {};
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined) {
                stringParams[key] = String(value);
            }
        });

        // update URL params for longitude & latitude
        setSearchParams(stringParams)
    }, [setSearchParams]);

    const handlePaginationData = useCallback((pagination: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
      }) => {

        console.log("new pagination from query", pagination)
        // console.log("URLParams", refs.current.urlParams)

        setState(prevState => ({ ...prevState, pagination }));

        if (pagination.currentPage !== refs.current.urlParams.page || pagination.pageSize !== refs.current.urlParams.num) {
            console.log("update URL page and num")
            
            let newParams = { ...refs.current.urlParams };
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

    }, [setSearchParams]);

    const handlePageNumberChange = (currentPage: number) => {
        if (currentPage !== refs.current.urlParams.page) {
            // console.log("update URL page")
            
            let newParams = { ...refs.current.urlParams };
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

    const handlePerPageChange = useCallback( async (newNum: number) => {
        if (refs.current.urlParams.num === undefined) return 
        
        console.log("check URL params per page", refs.current.urlParams.num, "versus newNum", newNum)
        if (newNum !== refs.current.urlParams.num) {
            console.log("update URL per page")
            
            let newParams = { ...refs.current.urlParams };
            newParams.num = newNum;

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
    }, [setSearchParams]);

    const handleOrderSwitch = (asc: boolean) => {

        console.log("new order", asc);
        console.log("update URL per page")
            
        let newParams = { ...refs.current.urlParams };
        newParams.asc = asc;

        // Convert all values to strings
        const stringParams: Record<string, string> = {};
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined) {
                stringParams[key] = String(value);
            }
        });

        // update URL params
        setSearchParams(stringParams)
        
    };

    useEffect(() => {

        const updateQueryParams = async () => {
            const params = Object.fromEntries([...searchParams]);

            // Initialize a new object for the updated URL parameters
            let newUrlParams: UrlParams = { ...refs.current.urlParams };

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
            if (JSON.stringify(newUrlParams) !== JSON.stringify(refs.current.urlParams)) {
                // console.log("setting url params in hook", newUrlParams);
                refs.current.urlParams = newUrlParams;
            } else {
                // console.log("no need to update URL params");
            }
    
            let userCoordinates: Coordinates | null = null;
            let needsGeolocation = false;
            let geolocationFailed = false;
    
            if (params.closest) {
                console.log("we gotta wait for geolocation")
                needsGeolocation = true;
                setState(prevState => ({ ...prevState, geolocating: true }));
                try {
                    if (globalUserCoordinates) userCoordinates = globalUserCoordinates;
                    else userCoordinates = await getUserLocation();
                } catch (error) {
                    geolocationFailed = true;
                    console.error(error);
                } finally {
                    setState(prevState => ({
                        ...prevState,
                        geolocating: false,
                        geolocationFailed
                    }));
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

            console.log("ready to set URL params")
    
            console.log(queryParams, geolocationFailed)
            if (JSON.stringify(queryParams) !== JSON.stringify(refs.current.query) || geolocationFailed) {
                // console.log("setting query state!")
                refs.current.query = queryParams;
                setState(prevState => ({
                    ...prevState,
                    // query: queryParams,
                    isQueryReady: !needsGeolocation || !!userCoordinates || geolocationFailed,
                }));
            }
            // else console.log("do not change state")
        }

        // Call the async function
        updateQueryParams();
    }, [searchParams, globalUserCoordinates, getUserLocation, updateZIPCode]);

    return (
        <div className="px-2 sm:px-4 md:px-20 md:pt-6">
            {/* <h1 className="text-lg font-semibold dark:text-white py-4">Corgi races locator</h1> */}
            <div className='w-full flex flex-col sm:flex-row justify-between mt-2 mb-6 gap-y-4'>
                <ZipCodeInput zipCode={state.zipCode || ''} onZipCodeChange={handleZipCodeUpdate} />
                <ItemsPerPage num={refs.current.query.num || 5} onPerPageChange={handlePerPageChange} />
            </div>
            <RaceTable
                query={refs.current.query}
                geolocating={state.geolocating}
                geolocationFailed={state.geolocationFailed}
                isQueryReady={state.isQueryReady}
                onPaginationData={handlePaginationData}
                onOrderSwitch={handleOrderSwitch}
            />
            {
                (!state.geolocating && !state.geolocationFailed) &&
                <div className='mt-6'>
                    <PaginationButton
                        page={refs.current.query.page || 1}
                        count={refs.current.query.num || 5}
                        total={state.pagination.totalRecords}
                        noFurtherPages={ state.pagination.currentPage >= state.pagination.totalPages }
                        changePageNumber={handlePageNumberChange}
                    />
                </div>
            }
        </div>
    )
}