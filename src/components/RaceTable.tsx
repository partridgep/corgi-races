import axios from 'axios';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { QueryParams, Pagination } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faArrowDown, faArrowUp, faExclamationCircle, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { LoadingCorgi } from './LoadingCorgi/LoadingCorgi';
import MapLinks from './MapLinks'

type tableProps = {
    query: QueryParams,
    geolocating?: boolean,
    geolocationFailed?: boolean,
    isQueryReady: boolean,
    onPaginationData?: (data: Pagination) => void,
    onOrderSwitch?: (asc: boolean) => void,
    allowOrdering?: boolean
}
type raceKeys = {
    race_id: string,
    datetime?: string;
    address?: string,
    city?: string,
    state?: string,
    zipcode: string,
    info_url?: string
}
type OrderClause = [string | { val: string }, 'ASC' | 'DESC'];
type OrderBy = OrderClause[];

export const RaceTable = (
    { 
        query: { id, num, page, startTime, endTime, asc, longitude, latitude },
        onPaginationData,
        onOrderSwitch,
        geolocating,
        geolocationFailed = false,
        isQueryReady,
        allowOrdering = true
    }
    : tableProps,
) => {

    const [state, setState] = useState({
        data: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            totalPages: 0,
            totalRecords: 0
        },
        orderBy: [],
        loading: true,
        showLoadingAnimation: true,
    });

    // Ref to track the previous onPaginationData
    const prevOnPaginationDataRef = useRef(onPaginationData);

    function useQueryParams({ id, asc, endTime, num, page, startTime, longitude, latitude }: QueryParams) {
        return useMemo(() => {
            return {
                id,
                asc,
                endTime,
                num,
                page,
                startTime,
                longitude,
                latitude
            };
        }, [id, asc, endTime, num, page, startTime, longitude, latitude]);
    }
    
    const queryParams = useQueryParams({ id, asc, endTime, num, page, startTime, longitude, latitude });

    const checkOrder = useCallback((orderBy: OrderBy): "ASC" | "DESC" | null => {
        if (!allowOrdering) return null
        for (let ordering of orderBy) {
            // check if the first element of the tuple is 'datetime'
            // return the order ('ASC' or 'DESC')
            if (ordering[0] === "datetime") return ordering[1]
        }
        return null
    }, [allowOrdering]);
    const dateOrdering = useMemo(() => checkOrder(state.orderBy), [state.orderBy, checkOrder]);
    
    useEffect(() => {
        if (state.loading) {
            const timer = setTimeout(() => {
                setState(prevState => ({
                    ...prevState,
                    showLoadingAnimation: state.loading
                }));
            }, 1000); // 1 second delay
    
            return () => clearTimeout(timer);
        }
        else {
            setState(prevState => ({
                ...prevState,
                showLoadingAnimation: false
            }));
        }
    }, [state.loading]);

    useEffect(() => {
        // console.log("use effect triggered", queryParams, geolocating, isQueryReady);

         // Avoid unnecessary re-renders due to unchanged onPaginationData
         // if `onPaginationData` changes, update the ref and skip the current render
        if (prevOnPaginationDataRef.current !== onPaginationData) {
            prevOnPaginationDataRef.current = onPaginationData;
            return;
        }
        setState(prevState => ({ ...prevState, loading: true, showLoadingAnimation: false }));

        // Only fetch data when the query is ready and geolocation has completed
        if (isQueryReady && !geolocating) {
            // console.log("query ready, done geolocating, go fetch!")
            let query = `/api/races`
            let count = 0
            for (let [paramKey, paramVal] of Object.entries(queryParams)) {
                if (paramVal !== null && paramVal !== undefined) {
                    if (count === 0) query += `/query?${paramKey}=${paramVal}`;
                    else query += `&${paramKey}=${paramVal}`;
                    count++;
                }
            }
            console.log("query: ", query)

            const fetchData = async () => {
                try {
                    const response = await axios.get(query);
                    const data = response.data;
                    console.log("new data", response.data)
    
                    setState(prevState => ({
                        ...prevState,
                        data: data.results,
                        pagination: data.pagination,
                        orderBy: data.order_by,
                        loading: false,
                        showLoadingAnimation: false,
                    }));
    
                    // Send pagination data to parent component
                    onPaginationData && onPaginationData(data.pagination);
                } catch (error) {
                    console.error("Error fetching race data:", error);
                }
            };
            fetchData()
        }
    }, [ queryParams, geolocating, isQueryReady, onPaginationData ]);

    function displayDate(dateStr?: string | null) {
        if (!dateStr) return
        let d = new Date(dateStr)
        let time = d.toLocaleTimeString()
        let timeWithoutSeconds = time.slice(0, -6)+time.slice(-3)
        return `${d.toLocaleDateString()} ${timeWithoutSeconds}`
    }

    // Handle page number click
    const handleOrderSwitch = () => {
        if (!onOrderSwitch) return;
        if (!dateOrdering) onOrderSwitch(true);
        else onOrderSwitch(dateOrdering !== "ASC");
    };

    return (
        <div>
            { state.loading && !state.showLoadingAnimation && null } {/* Initially nothing */}
            { 
                state.showLoadingAnimation && state.loading && 
                <LoadingCorgi /> 
            } {/* Corgi animation if loading takes more than 1 second */}
            { (!state.loading && geolocationFailed) &&
            <div className='flex flex-col items-center justify-center gap-y-3 mt-10'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faLocationDot} size="2xl" className='w-10 h-10 text-orange-400 stroke'/>
                    <FontAwesomeIcon icon={faExclamationCircle} size="lg" className='absolute -bottom-0.5 -right-0.5 text-orange-700 dark:text-gray-400 drop-shadow-2xl stroke dark:stroke-gray-900 stroke-1'/>
                </div>
                <p className='text-sm'>Could not find your location!</p>
            </div>
            }
            { (!state.loading && !geolocationFailed) &&
            <div className="border dark:border-slate-700 rounded shadow overflow-scroll" >
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 px-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                { dateOrdering
                                    ? 
                                    <button
                                        onClick={() => handleOrderSwitch()}
                                        className='flex gap-x-2'
                                    >
                                        Date
                                        <div>
                                            {
                                                dateOrdering === "ASC"
                                                ?
                                                <FontAwesomeIcon icon={faArrowDown} />
                                                :
                                                <FontAwesomeIcon icon={faArrowUp} />
                                            }
                                        </div>
                                    </button>
                                    :
                                    <p>Date</p>
                                }
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">City</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">State</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">ZIP</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white table-cell">Organized by</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white table-cell">Direct Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-500 bg-white dark:bg-slate-800">
                        { state.data.map((race: raceKeys) => (
                            <tr key={race.race_id}>
                                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">{displayDate(race.datetime)}</td>
                                <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    { (race.address && race.city && race.state) && 
                                        <MapLinks
                                            address={race.address}
                                            city={race.city}
                                            state={race.state}
                                            zipcode={race.zipcode}
                                        />
                                    }
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">{race.city}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">{race.state}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">{race.zipcode}</td>
                                <td className="px-3 py-4 text-sm text-gray-900 dark:text-white table-cell"></td>
                                <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                                    {race.info_url &&
                                        <a
                                            href={race.info_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:text-gray-500 dark:hover:text-gray-300 active:text-gray-600"
                                        >
                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                        </a>
                                    }
                                </td>
                            </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            }
        </div>
    )
}