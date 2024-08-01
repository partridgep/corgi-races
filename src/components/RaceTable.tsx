import axios from 'axios';
import React, { useState, useEffect } from 'react';

type tableProps = { num: number , startTime?: Date, endTime?: Date, asc: boolean }
type raceKeys = { datetime?: string; address?: string, city?: string, state?: string, info_url?: string }

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

    return (
        <div className="border rounded shadow" >
            <table className="min-w-full divide-y divide-gray-300 px-2">
                <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Location</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">City</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">State</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Organized by</th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Direct Link</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    { data.map((race: raceKeys) => (
                        <tr key={race.datetime}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">{race.datetime}</td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">{race.city}</td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">{race.city}</td>
                            <td className="px-3 py-4 text-sm text-gray-900">{race.state}</td>
                            <td></td>
                            <td className="hidden px-3 py-4 text-sm text-gray-900 lg:table-cell">{race.info_url}</td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}