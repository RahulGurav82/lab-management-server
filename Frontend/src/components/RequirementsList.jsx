import { useEffect, useState } from "react";

const RequirementsList = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/labs/all-requirements");
        const data = await response.json();
        setRequirements(data);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  return (
    <div className="h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Lab Requirements</h1>

      {loading ? (
        <p className="text-center">Loading requirements...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border">Lab ID</th>
                <th className="py-2 px-4 border">Lab Name</th>
                <th className="py-2 px-4 border">PC Number</th>
                <th className="py-2 px-4 border">Requirement Type</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req._id} className="text-center border-b">
                  <td className="py-2 px-4 border">{req.labId}</td>
                  <td className="py-2 px-4 border">{req.labName}</td>
                  <td className="py-2 px-4 border">{req.pcNumber}</td>
                  <td className="py-2 px-4 border">{req.requirementType}</td>
                  <td className="py-2 px-4 border">{req.description}</td>
                  <td className="py-2 px-4 border">{new Date(req.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequirementsList;
