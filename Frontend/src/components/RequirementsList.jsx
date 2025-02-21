import { useEffect, useState } from "react";

const RequirementsList = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, []);

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/labs/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequirements((prevRequirements) =>
          prevRequirements.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Action</th>
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
                  <td className="py-2 px-4 border font-semibold">
                    <span
                      className={`px-2 py-1 rounded ${
                        req.status === "Pending"
                          ? "bg-yellow-200 text-yellow-700"
                          : req.status === "Resolved"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    <select
                      className="px-2 py-1 border rounded cursor-pointer"
                      value={req.status}
                      onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
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
