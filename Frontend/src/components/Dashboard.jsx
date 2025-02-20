import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login"); // Redirect to login if not authenticated
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
    </div>
  );
};

export default Dashboard;
