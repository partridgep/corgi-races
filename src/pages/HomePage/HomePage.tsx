import { RaceTable } from "../../components/RaceTable"
import { Link } from "react-router-dom";
import './HomePage.css';

export const HomePage = () => {

    const strongStr = "herding";

    const linkToClosest = `/races?num=10&startTime=${new Date().toISOString()}&closest=true&asc=true&page=1`;
    const homepageQuery = {
        num: 10,
        startTime: new Date().toISOString(),
        asc: true
    }

    return (
        <div className="w-full pb-28 px-4">
            <h1 className="w-full text-corgi-red-400 stroke-2 dark:text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center mt-10 md:mt-20">Corgi Races</h1>
            <h2 className="w-full text-secondary dark:text-corgi-red-dark font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center mt-8 md:mt-12 md:mb-4"><span className="short-animate">Short</span> nubby legs</h2>
            <h2 className="w-full text-secondary dark:text-corgi-red-dark font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center my-1 md:my-4">
                <span className="leftOfLong-animate">+ </span>
                <span className="mx-2 relative long-animate">long</span>
                <span className="rightOfLong-animate"> potato bodies</span>
            </h2>
            <h2 className="w-full text-secondary dark:text-corgi-red-dark font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center my-1 md:my-4">+ strong
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
                 energy</h2>
            <h2 className="w-full text-secondary dark:text-corgi-red-dark font-medium text-semibold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center mt-1 md:mt-8 mb-10 md:mb-16">= a recipe for a hilarious competition</h2>
            <div className="w-full mx-auto md:mt-6 mb-12 text-center">
                <Link
                    to={linkToClosest}
                    className="rounded-full bg-secondary-200 mx-auto px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Find nearest corgi race
                </Link>
            </div>
            <p className="w-full dark:text-gray-200 text-center italic mb-4 text-sm">Upcoming races</p>
            <div className="sm:px-4 md:px-20">
                <RaceTable query={homepageQuery} isQueryReady={true} allowOrdering={false} />
            </div>
        </div>
    )
}