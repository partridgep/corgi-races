import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { QueryParams } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type tableProps = {
    query: QueryParams,
    geolocating?: Boolean,
    isQueryReady: boolean;
}
type raceKeys = {
    race_id: string,
    datetime?: string;
    address?: string,
    city?: string,
    state?: string,
    info_url?: string
}

export const RaceTable = (
    { 
        query: { id, num, startTime, endTime, asc, longitude, latitude },
        geolocating,
        isQueryReady
    }
    : tableProps,
) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        if (isQueryReady && !geolocating) {
            let query = `/api/races`
            const queryParams = {
                id,
                num,
                startTime,
                endTime,
                asc,
                longitude,
                latitude
            }
            console.log(queryParams)
            // let query = `/api/races?${new URLSearchParams(queryParams as Record<string, string>).toString()}`;
            let count = 0
            for (let [ paramKey, paramVal ] of Object.entries(queryParams)) {
                if (paramVal !== null && paramVal !== undefined) {
                    if (count === 0) query += `/query?${paramKey}=${paramVal}`
                    else query += `&${paramKey}=${paramVal}`
                    count++
                }
            }
            const fetchData = async () => {
                axios.get(query)
                .then(res => res.data)
                .then(data => {
                    setData(data)
                    console.log(data)
                    setLoading(false)
                });
            }
            fetchData()
        }
    }, [ id, asc, endTime, num, startTime, longitude, latitude, geolocating, isQueryReady ]);

    function displayDate(dateStr?: string | null) {
        if (!dateStr) return
        let d = new Date(dateStr)
        let time = d.toLocaleTimeString()
        let timeWithoutSeconds = time.slice(0, -6)+time.slice(-3)
        return `${d.toLocaleDateString()} ${timeWithoutSeconds}`
    }

    return (
        <div>
            { !loading ? 
            <div className="border dark:border-slate-700 rounded shadow" >
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 px-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white lg:table-cell">Location</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">City</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">State</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Organized by</th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">Direct Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-500 bg-white dark:bg-slate-800">
                        { data.map((race: raceKeys) => (
                            <tr key={race.race_id}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:w-auto sm:max-w-none">{displayDate(race.datetime)}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">{race.address}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">{race.city}</td>
                                <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{race.state}</td>
                                <td></td>
                                <td className="hidden px-3 py-4 text-sm text-gray-900 dark:text-white lg:table-cell">
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
            :
            <p>Loading...</p>
            }
        </div>
    )
}