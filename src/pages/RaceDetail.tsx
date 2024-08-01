import { useParams } from "react-router-dom"

export const RaceDetail = () => {

    const { raceID } = useParams()
    console.log(raceID)

    return (
        <h1>All about race #{raceID}</h1>
    )
}