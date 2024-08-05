import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

type tableProps = { num: number , startTime?: Date, endTime?: Date, asc: boolean }
type raceKeys = { race_id: string, datetime?: string; address?: string, city?: string, state?: string, info_url?: string }

export const RaceTable = (
    { num, startTime, endTime, asc }
    : tableProps
) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            axios.get('/api/races')
            .then(res => res.data)
            .then(data => setData(data));
        }
        fetchData()
    }, []);

    function displayDate(dateStr?: string | null) {
        if (!dateStr) return
        let d = new Date(dateStr)
        let time = d.toLocaleTimeString()
        let timeWithoutSeconds = time.slice(0, -6)+time.slice(-3)
        return `${d.toLocaleDateString()} ${timeWithoutSeconds}`
    }

    return (
        <div className="border rounded shadow" >
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 px-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Location</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">City</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">State</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Organized by</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Direct Link</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    { data.map((race: raceKeys) => (
                        <tr key={race.race_id}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">{displayDate(race.datetime)}</td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">{race.address}</td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">{race.city}</td>
                            <td className="px-3 py-4 text-sm text-gray-900">{race.state}</td>
                            <td></td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">
                                {race.info_url &&
                                    <a href={race.info_url} target="_blank" rel="noreferrer" className='hover:text-gray-500 active:text-gray-600'>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                    </a>
                                }
                            </td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}