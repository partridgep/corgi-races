// import React from 'react';
// { useState, useEffect } 
import { Routing } from "./Routing"
import './App.css';
// import { Coordinates } from './types';

function App() {

//   const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);

//   useEffect(() => {
//     const fetchCoordinates = async () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const coords = {
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                     };
//                     // Store coordinates in state or context
//                     setUserCoordinates(coords);
//                 },
//                 (error) => console.error("Error fetching coordinates:", error),
//                 { enableHighAccuracy: true }
//             );
//         }
//     };

//     fetchCoordinates();
// }, []);


  return (
    <Routing />
  );
}

export default App;
