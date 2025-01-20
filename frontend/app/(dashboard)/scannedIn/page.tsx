"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ScannedItem {
  createdBy: string;
  createdAt: string;
  lotNumber: string;
  bagNumber: string;
}

const ITEMS_PER_PAGE = 10;

const ScannedInPage = () => {
  const router = useRouter();
  const [data, setData] = useState<ScannedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchScannedInData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const response = await fetch("http://localhost:8081/api/v1/bag/scanIn", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchScannedInData();
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Scanned In</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && paginatedData.length > 0 ? (
        <>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Created By</th>
                <th className="border border-gray-300 p-2">Created At</th>
                <th className="border border-gray-300 p-2">Lot Number</th>
                <th className="border border-gray-300 p-2">Bag Number</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{item.createdBy}</td>
                  <td className="border border-gray-300 p-2">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">{item.lotNumber}</td>
                  <td className="border border-gray-300 p-2">{item.bagNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 mx-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 mx-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-lg mt-4">No scanned-in bags found.</p>
      )}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ScannedInPage;
