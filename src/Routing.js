import { BrowserRouter as Router, Routes, Route, 
    // Redirect
} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import { HomePage } from "./pages/HomePage/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RaceList } from "./pages/RaceList/RaceList";
import { RaceDetail } from "./pages/RaceDetail";
import { Fragment } from "react/jsx-runtime";

export const Routing = () => {
    return (
        <Router>
            <Fragment>
                <Header />
            </Fragment>
            <Routes>
                <Route path="/" exact element={<HomePage />} />
                <Route path="/races" exact element={<RaceList />} />
                <Route path="/races/:raceID"  element={<RaceDetail />} />
                <Route path ="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}