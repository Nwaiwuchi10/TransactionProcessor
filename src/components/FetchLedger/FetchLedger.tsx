import { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../../Api/Base_url";

type Transaction = {
  _id: string;
  transactionId: string;
  amount: number;
  timestamp: string;
  sourceSystem: "A" | "B";
};

type ApiResponse = {
  data: Transaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const PaginatedTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [source, setSource] = useState<"A" | "B" | "">("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ApiResponse>(
        `${Base_Url}/transactions`,
        {
          params: {
            source: source || undefined,
            page,
            limit,
          },
        }
      );

      setTransactions(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, source]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* Filter */}
      <div className="mb-4 flex gap-4 items-center">
        <label htmlFor="source" className="text-sm font-medium">
          Filter by Source:
        </label>
        <select
          id="source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value as "A" | "B" | "");
            setPage(1);
          }}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">All Sources</option>
          <option value="A">Source A</option>
          <option value="B">Source B</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Transaction ID</th>
              <th className="px-4 py-3 border">Amount</th>
              <th className="px-4 py-3 border">Source</th>
              <th className="px-4 py-3 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-red-600 py-6">
                  {error}
                </td>
              </tr>
            ) : transactions?.length > 0 ? (
              transactions?.map((tx, index) => (
                <tr key={tx?._id} className="border-t">
                  <td className="px-4 py-2">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2">{tx?.transactionId}</td>
                  <td className="px-4 py-2">{tx?.amount?.toFixed(2)}</td>
                  <td className="px-4 py-2">{tx?.sourceSystem}</td>
                  <td className="px-4 py-2">
                    {new Date(tx?.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTransactions;
