import './Header.css'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CorgiLogo } from '../../public/a-happy-pembroke-welsh-corgi-running-at-high-speed (2).svg'

const Header = () => {

    const [state, setState] = useState({
        logoHovered: false,
    });

    const handleLogoHover = () => {
        setState(prevState => ({
            ...prevState,
            logoHovered: true,
        }));
    };

    const handleMouseOut = () => {
        setState(prevState => ({
            ...prevState,
            logoHovered: false,
        }));
    };

    const handleClick = () => {
        setTimeout(() => handleMouseOut(), 60)
    };

    return (
        <div
            className='px-2 sm:px-4 h-16 md:px-20 sticky top-0 backdrop-blur-xl dark:border-b dark:border-gray-800 bg-white bg-opacity-80 dark:bg-opacity-10 z-10'
        >
            <Link
                to="/"
                className='inline-block'
                onMouseOver={handleLogoHover}
                onMouseLeave={handleMouseOut}
                onClick={handleClick}
            >
                <div className={`flex items-center gap-x-2 w-fit ${(state.logoHovered === true) && 'logoHovered'}`}      >
                    <CorgiLogo />
                    <h2
                        className={`text-xl font-bold text-corgi-red dark:text-white transition-all ${(state.logoHovered === true) && 'opacity-60'}`}
                    >Corgi Races</h2>
                </div>
            </Link>
        </div>
    )
}

export default Header;