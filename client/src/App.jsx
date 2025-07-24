import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@components/Login";
import HeroSection from "@components/HeroSection";
import OAuthSuccess from "@components/OAuthSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess/>}/>
      </Routes>
    </Router>
  );
}

export default App;
