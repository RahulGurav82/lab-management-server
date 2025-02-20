import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [name, setname] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login"); // Redirect to login if not authenticated
  }, [navigate]);

  const handleCreateLab = async () => {
    if (!name || !capacity) {
      setMessage("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/labs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ name, capacity }),
        body: JSON.stringify({ name, capacity: parseInt(capacity, 10) }),

      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Lab created successfully!");
      } else {
        setMessage(data.message || "Failed to create lab.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.", {error});
    }

    setShowPopup(false);
    setname("");
    setCapacity("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      
      {/* Create Lab Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        Create Lab
      </button>

      {/* Popup for Lab Creation */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Create New Lab</h2>

            <input
              type="text"
              placeholder="Lab Name"
              className="w-full border p-2 mb-2 rounded"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />

            <input
              type="number"
              placeholder="Capacity"
              className="w-full border p-2 mb-2 rounded"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={handleCreateLab}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Confirmation Message */}
      {message && (
        <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default Dashboard;
