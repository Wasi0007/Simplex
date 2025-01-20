"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define a type for the user data
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  // Add any other properties returned from the API
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // Type userData
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Fetch authenticated user data
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      router.push("/login"); // Redirect to login if unauthenticated
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/user/${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data); // Assuming the response structure has a `data` field
        } else {
          setErrorMessage("Failed to fetch user data.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setErrorMessage("An error occurred. Please try again later.");
      }
    };

    fetchUserData();
  }, [router]);

  const navigationButtons = [
    { label: "Generate Barcode", path: "/generate-barcode", color: "bg-blue-500" },
    { label: "Scan Barcode", path: "/scan-barcode", color: "bg-green-500" },
    { label: "Scanned In", path: "/scannedIn", color: "bg-purple-500" },
    { label: "Scanned Out", path: "/scannedOut", color: "bg-red-500" },
  ];

  if (errorMessage) {
    return <div className="text-red-500 text-sm text-center mt-4">{errorMessage}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {userData && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 text-center">Welcome, {userData.firstName}</h2>
          <p className="text-gray-600 text-center">Email: {userData.email}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {navigationButtons.map((btn, index) => (
          <button
            key={index}
            onClick={() => router.push(btn.path)}
            className={`${btn.color} text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-300`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
