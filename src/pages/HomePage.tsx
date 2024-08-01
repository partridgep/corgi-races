import { RaceTable } from "../components/RaceTable"

export const HomePage = () => {
    return (
        <div className="w-full">
            <h1 className="w-full text-5xl font-bold text-center mt-16">Corgi Races</h1>
            <h2 className="w-full text-gray-700 text-lg text-center mt-2 mb-16">Short nubby legs + long potato bodies + strong herding energy = a recipe for a hilarious competition</h2>
            <div className="w-full mx-auto mt-6 mb-12 text-center">
                <button
                    type="button"
                    className="rounded-full bg-indigo-600 mx-auto px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Find nearest corgi race
                </button>
            </div>
            <p className="w-full text-center italic mb-4 text-sm">Upcoming races</p>
            <div className="px-2 sm:px-4 md:px-20">
                <RaceTable num={1} startTime={new Date()} asc={true} />
            </div>
        </div>
    )
}