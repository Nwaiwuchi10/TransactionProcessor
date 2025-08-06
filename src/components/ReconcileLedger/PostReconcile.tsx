import { useState } from "react";
import axios from "axios";
import AdminDashboard from "../../dashboard/Dashboard";
import { Base_Url } from "../../Api/Base_url";

type ReconciliationReport = {
  _id: string;
  uploadedBy: string;
  missingInA: string[];
  missingInB: string[];
  amountMismatches: string[];
  statusMismatches: string[];
  createdAt: string;
};

const Reconciliation = () => {
  const [uploadedBy] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReconciliationReport | null>(null);
  const [error, setError] = useState("");

  const handleReconcile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post<{
        message: string;
        report: ReconciliationReport;
      }>(`${Base_Url}/reconciliation`, {
        uploadedBy,
      });
      setReport(response.data.report);
    } catch (err: any) {
      setError(err.response?.data?.message || "Reconciliation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboard>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="bg-white shadow-md rounded-xl w-full max-w-3xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Reconciliation Transaction
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Uploaded By"
            /> */}
            <button
              onClick={handleReconcile}
              disabled={loading}
              style={{ backgroundColor: "#050531fb", color: "white" }}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Reconciling..." : "Start Reconciliation"}
            </button>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          {report && (
            <div className="mt-6 space-y-4" style={{ marginTop: "40px" }}>
              <h3 className="text-xl font-semibold text-gray-800">
                Report Summary
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Uploaded By:</strong> {report.uploadedBy}
                </li>
                <li>
                  <strong>Missing in System A:</strong>{" "}
                  {report.missingInA.length}
                </li>
                <li>
                  <strong>Missing in System B:</strong>{" "}
                  {report.missingInB.length}
                </li>
                <li>
                  <strong>Amount Mismatches:</strong>{" "}
                  {report.amountMismatches.length}
                </li>
                <li>
                  <strong>Status Mismatches:</strong>{" "}
                  {report.statusMismatches.length}
                </li>
                <li>
                  <strong>Generated:</strong>{" "}
                  {new Date(report.createdAt).toLocaleString()}
                </li>
              </ul>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">
                        Mismatch Type
                      </th>
                      <th className="border px-3 py-2 text-left">
                        Transaction IDs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      [
                        ["Missing in A", report.missingInA],
                        ["Missing in B", report.missingInB],
                        ["Amount Mismatches", report.amountMismatches],
                        ["Status Mismatches", report.statusMismatches],
                      ] as [string, string[]][]
                    ).map(([label, list]) => (
                      <tr key={label}>
                        <td className="border px-3 py-2 font-medium">
                          {label}
                        </td>
                        <td className="border px-3 py-2 break-all">
                          {list.length > 0 ? list.join(", ") : "None"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Reconciliation;
