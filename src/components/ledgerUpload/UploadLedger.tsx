// src/components/TransactionProcessor.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import type { FlaggedTransaction, TransactionPay } from "../../Api/Types";
import { Base_Url } from "../../Api/Base_url";

const TransactionProcessor = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTx((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTx((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, []);
  const [tx, setTx] = useState<TransactionPay>({
    transactionId: "",
    userId: "",
    amount: 0,
    timestamp: new Date().toISOString(),
    merchant: "",
    location: { lat: 0, lng: 0 },
  });

  const [flaggedTxs, setFlaggedTxs] = useState<FlaggedTransaction[]>([]);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTx((prev: any) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setTx((prev: any) => ({
  //     ...prev,
  //     location: {
  //       ...prev.location,
  //       [name]: Number(value),
  //     },
  //   }));
  // };

  const submitTransaction = async () => {
    try {
      await axios.post(
        "https://transaction-reconcilation-task-o3m16vayf-nwaiwuchi10s-projects.vercel.app/trans",
        tx,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Transaction processed successfully.");
    } catch (err: any) {
      setMessage("Error processing transaction: " + err.message);
    }
  };

  const fetchFlagged = async () => {
    if (!tx.userId) {
      setMessage("Enter a userId to fetch flagged transactions.");
      return;
    }

    try {
      const res = await axios.get(`${Base_Url}/trans/fraud-check`, {
        params: { userId: tx.userId },
      });
      setFlaggedTxs(res.data.flagged);
    } catch (err: any) {
      setMessage("Error fetching flagged transactions: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Process Transaction</h2>
      <div>
        <div>
          <label className="block mb-2">Transaction Details</label>
        </div>

        <div>
          <input
            type="text"
            name="transactionId"
            placeholder="Transaction ID"
            value={tx.transactionId}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-2">User Details</label>
        </div>
        <div>
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={tx.userId}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-2">Amount</label>
        </div>
        <div>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={tx.amount}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-2">Merchant</label>
        </div>
        <div>
          <input
            type="text"
            name="merchant"
            placeholder="Merchant"
            value={tx.merchant}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
      </div>
      <div>
        <div>
          <label className="block mb-2">Time</label>
        </div>
        <div>
          {" "}
          <input
            type="datetime-local"
            name="timestamp"
            value={new Date(tx.timestamp).toISOString().slice(0, 16)}
            onChange={(e) =>
              setTx((prev: any) => ({
                ...prev,
                timestamp: new Date(e.target.value).toISOString(),
              }))
            }
            className="border p-2 w-full"
          />
        </div>
      </div>

      {/* <input
        type="number"
        name="lat"
        placeholder="Latitude"
        value={tx.location.lat}
        onChange={handleLocationChange}
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="lng"
        placeholder="Longitude"
        value={tx.location.lng}
        onChange={handleLocationChange}
        className="border p-2 w-full"
      /> */}

      <div className="flex gap-2 mt-4 mb-4">
        <button
          onClick={submitTransaction}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Transaction
        </button>
        <button
          onClick={fetchFlagged}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Get Flagged Transactions
        </button>
      </div>

      {message && <p className="text-sm text-gray-700">{message}</p>}

      {flaggedTxs.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">Flagged Transactions</h3>
          <ul className="list-disc pl-5">
            {flaggedTxs.map((f) => (
              <li key={f.transactionId}>
                {f.timestamp} | Reason: {f.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionProcessor;
