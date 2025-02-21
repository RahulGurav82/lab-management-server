import { useEffect, useState } from "react";

const LabsList = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState(null);
  const [connectedPCs, setConnectedPCs] = useState([]);
  const [loadingPCs, setLoadingPCs] = useState(false);

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

  const fetchConnectedPCs = async (labId) => {
    setLoadingPCs(true);
    try {
      const response = await fetch(`http://localhost:5000/api/labs/${labId}/connected-pcs`);
      const data = await response.json();
      setSelectedLab({ id: labId, name: data.labName }); // Store both Lab ID & Name
      setConnectedPCs(data.connectedPCs);
    } catch (error) {
      console.error("Error fetching connected PCs:", error);
    } finally {
      setLoadingPCs(false);
    }
  };

  return (
    <div className="h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Labs</h1>

      {loading ? (
        <p className="text-center">Loading labs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div
              key={lab._id}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => fetchConnectedPCs(lab.labId)}
            >
              <h2 className="text-2xl font-semibold">{lab.name}</h2>
              <p className="text-gray-700">
                Lab ID: <strong>{lab.labId}</strong>
              </p>
              <p className="text-gray-700">Capacity: {lab.capacity}</p>
              <p className="text-gray-700">
                Connected PCs: <strong>{lab.connectedPCs.length}</strong>
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedLab && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">
            Connected PCs in {selectedLab.name}
          </h2>
          {loadingPCs ? (
            <p className="text-center">Loading connected PCs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedPCs.map((pc) => (
                <div key={pc.pcNumber} className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <div className="w-full h-40 bg-black mb-2 flex items-center justify-center">
                    <img
                      src={`http://localhost:8080/stream/${selectedLab?.id}/${pc.pcNumber}`}
                      onError={(e) => { e.target.src = "/fallback-image.jpg"; }}
                      alt={`Screen Stream - PC ${pc.pcNumber}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <p className="text-center font-bold">PC: {pc.pcNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LabsList;
