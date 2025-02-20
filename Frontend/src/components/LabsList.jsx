import { useEffect, useState } from "react";

const LabsList = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/labs");
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error("Error fetching labs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  return (
    <div className="h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Labs</h1>

      {loading ? (
        <p className="text-center">Loading labs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div key={lab._id} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold">{lab.name}</h2>
              <p className="text-gray-700">Lab ID: <strong>{lab.labId}</strong></p>
              <p className="text-gray-700">Capacity: {lab.capacity}</p>
              <p className="text-gray-700">
                Connected PCs: <strong>{lab.connectedPCs.length}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabsList;
