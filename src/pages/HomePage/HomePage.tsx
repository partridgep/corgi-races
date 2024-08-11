import { RaceTable } from "../../components/RaceTable"
import { Link } from "react-router-dom";
import './HomePage.css';

export const HomePage = () => {

    const strongStr = "herding";

    const linkToClosest = `/races?num=10&startTime=${new Date().toISOString()}&closest=true&asc=true`;
    const homepageQuery = {
        num: 10,
        startTime: new Date(),
        asc: true
    }

    return (
        <div className="w-full pb-28">
            <h1 className="w-full dark:text-white text-8xl font-bold text-center mt-40">Corgi Races</h1>
            <h2 className="w-full subtitle text-5xl text-center mt-12 mb-4"><span className="short-animate">Short</span> nubby legs</h2>
            <h2 className="w-full subtitle text-5xl text-center my-4">
                <span className="leftOfLong-animate">+ </span>
                <span className="mx-2 relative long-animate">long</span>
                <span className="rightOfLong-animate"> potato bodies</span>
            </h2>
            <h2 className="w-full subtitle text-5xl text-center my-4">+ strong
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
            <h2 className="w-full subtitle text-semibold text-5xl text-center mt-4 mb-16">= a recipe for a hilarious competition</h2>
            <div className="w-full mx-auto mt-6 mb-12 text-center">
                <Link
                    to={linkToClosest}
                    className="rounded-full bg-indigo-600 mx-auto px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Find nearest corgi race
                </Link>
            </div>
            <p className="w-full dark:text-gray-200 text-center italic mb-4 text-sm">Upcoming races</p>
            <div className="px-2 sm:px-4 md:px-20">
                <RaceTable query={homepageQuery} />
            </div>
        </div>
    )
}