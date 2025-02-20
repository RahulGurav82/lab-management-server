import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import LabsList from "./components/LabsList";
import RequirementsList from "./components/RequirementsList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/labs" element={<LabsList />} />
        <Route path="/requirements" element={<RequirementsList />} />
        <Route path="*" element={<Login />} /> {/* Default to login */}
      </Routes>
    </Router>
  );
}

export default App;
