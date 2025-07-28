import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@components/Login";
import HeroSection from "@components/HeroSection";
import OAuthSuccess from "@components/OAuthSuccess";
import Signup from "@components/signup";
import PageNotFound from "@components/PageNotFound";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />
                <Route path="/*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
