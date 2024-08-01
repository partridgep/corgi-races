import { BrowserRouter as Router, Routes, Route, 
    // Redirect
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RaceList } from "./pages/RaceList";
import { RaceDetail } from "./pages/RaceDetail";

export const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<HomePage />} />
                <Route path="/races" exact element={<RaceList />} />
                <Route path="/races/:raceID"  element={<RaceDetail />} />
                <Route path ="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}