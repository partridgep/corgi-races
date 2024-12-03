import { RaceTable } from "../../components/RaceTable"
import { Link } from "react-router-dom";
import './HomePage.css';
import img from '../../public/Musubi_running.webp'

export const HomePage = () => {

    const strongStr = "herding";

    const linkToClosest = `/races?num=10&startTime=${new Date().toISOString()}&closest=true&asc=true&page=1`;
    const homepageQuery = {
        num: 10,
        startTime: new Date().toISOString(),
        asc: true
    }

    return (
        <div className="w-full pb-28 sm:px-4">
            <h1 className="w-full text-corgi-red-400 stroke-2 dark:text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mt-10 md:mt-20">Corgi Races</h1>
            <div className="flex flex-row w-full items-center justify-start lg:justify-center gap-x-6 pr-5 md:mt-12 lg:px-16 overflow-hidden">
                <div className="subtitle-wrapper lg:w-auto">
                    <div className="max-w-80 sm:max-w-sm md:max-w-xl lg:max-w-full flex flex-col lg:flex-row lg:gap-x-10 lg:items-center lg:justify-evenly pl-8 pr-2 lg:pr-10 mx-auto">
                        <h2 className="lg:flex lg:flex-col subtitle text-left lg:text-center text-secondary dark:text-corgi-red font-medium subtitle mt-8 md:mt-2">
                            <span className="short-animate">Short</span>
                            <span className="lg:hidden">&nbsp;</span>
                            <span>nubby</span>
                            <span className="lg:hidden">&nbsp;</span>
                            <span>legs</span>
                        </h2>
                        <h2 className="subtitle hidden lg:inline-block text-secondary dark:text-corgi-red font-medium">+</h2>
                        <h2 className="lg:flex lg:flex-col subtitle text-right lg:text-center text-secondary dark:text-corgi-red font-medium subtitle my-2">
                            <span className="lg:hidden leftOfLong-animate">+ </span>
                            <span className="lg:hidden">&nbsp;</span>
                            <span className="mx-2 relative long-animate">long</span>
                            <span className="rightOfLong-animate lg:flex lg:flex-col"> <span>potato</span>
                            <span className="lg:hidden">&nbsp;</span>
                            <span>bodies</span></span>
                        </h2>
                        <h2 className="subtitle hidden lg:inline-block text-secondary dark:text-corgi-red font-medium">+</h2>
                        <h2 className="lg:flex lg:flex-col subtitle text-secondary dark:text-corgi-red font-medium subtitle text-left lg:text-center my-2">
                            <span className="lg:hidden">+ </span>
                            <span>strong</span>
                            <span className="mx-2 strong-animate">
                                {strongStr.split("").map(function(char, index) {
                                    const style = { animationDelay: (0.1 + index / 10) + "s" };
                                    return <span
                                        aria-hidden="true"
                                        key={index}
                                        className="strong-animate"
                                        style={style}
                                    >
                                        {char}
                                    </span>;
                                })}
                            </span>
                            <span>energy</span>
                        </h2>
                        <h2 className="subtitle hidden lg:inline-block text-secondary dark:text-corgi-red font-medium">=</h2>
                        <h2 className="subtitle lg:flex lg:flex-col lg:text-center text-secondary dark:text-corgi-red font-medium text-semibold text-right sm:text-center mt-4 md:mt-8 mb-10 md:mb-16 lg:my-0">
                            <span className="lg:hidden">= </span> a hilarious <span>competition</span>
                        </h2>
                    </div>
                </div>
                <img src={img} alt="running-corgi-img" className="musubi-img transition-all" />
            </div>
            <div className="w-full mx-auto md:mt-6 mb-12 text-center">
                <Link
                    to={linkToClosest}
                    className="rounded-full transition-all bg-secondary-200 mx-auto px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Find nearest corgi race
                </Link>
            </div>
            <p className="w-full dark:text-gray-200 text-center italic mb-4 text-sm">Upcoming races</p>
            <div className="px-4 md:px-20">
                <RaceTable query={homepageQuery} isQueryReady={true} allowOrdering={false} />
            </div>
        </div>
    )
}