import './Header.css'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CorgiLogo } from '../../public/a-happy-pembroke-welsh-corgi-running-at-high-speed (2).svg'

const Header = () => {

    const [state, setState] = useState({
        logoHovered: false,
        theme: localStorage.getItem('dark-mode') === 'true' ? "dark" : "light"
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

    // Toggle dark mode
    const toggleDarkMode = () => {
        if (state.theme === 'dark') {
            setState(prevState => ({
                ...prevState,
                theme: 'light',
            }));
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dark-mode', 'false');
        } else {
            setState(prevState => ({
                ...prevState,
                theme: 'dark',
            }));
            document.documentElement.classList.add('dark');
            localStorage.setItem('dark-mode', 'true');
        }
    };

    // Check the current theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('dark-mode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'true' || (!savedTheme && systemPrefersDark)) {
            setState(prevState => ({
                ...prevState,
                theme: 'dark',
            }));
            document.documentElement.classList.add('dark');
        } else {
            setState(prevState => ({
                ...prevState,
                theme: 'light',
            }));
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <div
            className='flex justify-between px-2 sm:px-4 h-16 md:px-20 sticky top-0 backdrop-blur-xl dark:border-b dark:border-gray-800 bg-white bg-opacity-80 dark:bg-opacity-10 z-10'
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
            <div className="flex flex-col justify-center ml-3">
                <label className="theme-toggle group" title="Toggle theme">
                    <input
                        type="checkbox"
                        checked={state.theme === 'dark'}
                        onChange={toggleDarkMode}
                        aria-label="Toggle dark mode"
                    />
                    <span className="theme-toggle-sr">Switch to {state.theme === 'dark' ? 'light' : 'dark'} mode</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        width="1.5em"
                        height="1.5em"
                        strokeLinecap="round"
                        className="fill-slate-400 group-hover:fill-slate-500 theme-toggle__classic"
                        viewBox="0 0 32 32"
                    >
                        <clipPath id="theme-toggle__classic__cutout">
                            <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
                        </clipPath>
                        <g clipPath="url(#theme-toggle__classic__cutout)">
                            <circle cx="16" cy="16" r="9.34" />
                            <g className="stroke-slate-400 stroke-2">
                                <path d="M16 3.5v-2" />
                                <path d="M16 30.5v-2" />
                                <path d="M1.5 16h2" />
                                <path d="M28.5 16h2" />
                                <path d="m25 7.6 1.8-1.8" />
                                <path d="m5.7 26.3 1.9-1.9" />
                                <path d="m5.8 5.8 1.8 1.8" />
                                <path d="m24.4 25 1.9 1.9" />
                            </g>
                        </g>
                    </svg>
                </label>
            </div>
        </div>
    )
}

export default Header;