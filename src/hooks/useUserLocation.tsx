import { useEffect, useState } from 'react';
import { Coordinates } from '../types';

const useUserLocation = () => {
    const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

                if (permissionStatus.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setUserCoordinates({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                        },
                        (error) => {
                            console.error('Error fetching coordinates:', error.message);
                        }
                    );
                }
            } catch (error) {
                console.error('Failed to fetch geolocation permissions:', error);
            }
        };

        fetchCoordinates();
    }, []);

    return userCoordinates;
};

export default useUserLocation;
