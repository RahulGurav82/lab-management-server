import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateLab from "./CreateLab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>

      {/* Create Lab Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mr-4"
      >
        Create Lab
      </button>

      {/* Show Labs Button */}
      <button
        onClick={() => navigate("/labs")}
        className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 mr-4"
      >
        Show Labs
      </button>

      {/* Show Requirements Button */}
      <button
        onClick={() => navigate("/requirements")}
        className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
      >
        Show Requirements
      </button>

      {showPopup && <CreateLab onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Dashboard;
