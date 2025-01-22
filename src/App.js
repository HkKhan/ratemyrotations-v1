import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./LandingPage"; // Import your component
import RotationForm from "./RotationForm"; // Import your component
import SearchResults from "./SearchResults";
import RotationDetail from "./RotationDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/add" element={<RotationForm />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/rotation/:siteId" element={<RotationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
