import React, { useRef } from 'react';

type locationProps = {
    address: string,
    city: string,
    state: string,
    zipcode: string
}

const MapLinks = ({ address, city, state, zipcode }: locationProps) => {

  const addressLink = useRef(
    // open on default maps app on iOS
    ((navigator.platform.indexOf("iPhone") !== -1) || 
     (navigator.platform.indexOf("iPad") !== -1) || 
     (navigator.platform.indexOf("iPod") !== -1))
    ?
    `maps://maps.google.com/maps/search/?api=1&query=${encodeURIComponent(address)},${encodeURIComponent(city)},${encodeURIComponent(state)},${encodeURIComponent(zipcode)}`
    // open in Google Maps otherwise
    :
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)},${encodeURIComponent(city)},${encodeURIComponent(state)},${encodeURIComponent(zipcode)}`
  );


  return (
    <div>
        <a
            href={addressLink.current}
            target="_blank"
            rel="noopener noreferrer"
            className='underline hover:text-gray-500 dark:hover:text-gray-300'
        >
            {address}
            <p className='lg:hidden'>{city} {state} {zipcode}</p>
        </a>
    </div>
  );
};

export default MapLinks;
