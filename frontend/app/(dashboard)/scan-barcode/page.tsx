'use client'; // Marks this file as a client-side component in Next.js

import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

const ScanBarcodePage = () => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [lotNumber, setLotNumber] = useState<string>("");
  const [bagNumber, setBagNumber] = useState<string>("");
  const router = useRouter();

  // Use useRef to persist the scanner across re-renders
  const html5QrcodeScannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (html5QrcodeScannerRef.current) return;

    // Configuration options for the scanner
    const config = {
      fps: 10, // Set the frame rate for scanning
      qrbox: { width: 400, height: 250 },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
    };

    // Success callback when QR code is scanned
    const onScanSuccess = async (decodedText: string) => {
      console.log(`Decoded text: ${decodedText}`);

      // Extract lotNumber and bagNumber from the barcode
      const match = decodedText.match(/^([A-Za-z])-([0-9]+)_([0-9]+)-([A-Za-z])$/);
      if (match) {
        const extractedLotNumber = match[2];
        const extractedBagNumber = match[3];
        setLotNumber(extractedLotNumber);
        setBagNumber(extractedBagNumber);
        console.log(`Extracted lotNumber: ${extractedLotNumber}, bagNumber: ${extractedBagNumber}`);
        
        // Send extracted data to the API
        await sendToApi(extractedLotNumber, extractedBagNumber);
      } else {
        console.error("Invalid barcode format");
        setApiResponse("Invalid barcode format");
      }
    };

    // Error callback when scanning fails
    const onScanError = (errorMessage: string) => {
      console.error(`Scan error: ${errorMessage}`);
    };

    // Initialize the QR Code scanner
    html5QrcodeScannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);
    html5QrcodeScannerRef.current.render(onScanSuccess, onScanError); // Pass both callbacks

    // Clean up when the component is unmounted
    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
    };
  }, []); // Empty dependency array for one-time initialization

  // Function to send extracted data to the API
  const sendToApi = async (lotNumber: string, bagNumber: string) => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve token inside function

      if (!token) {
        console.error("No auth token found");
        setApiResponse("No auth token found. Please log in.");
        return;
      }

      const requestBody = JSON.stringify({ lotNumber, bagNumber });
      console.log("Request JSON:", requestBody);

      const response = await fetch("http://localhost:8081/api/v1/bag/scanOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: requestBody,
      });

      if (response.status === 403) {
        console.error("Access forbidden: Check API permissions and token");
        setApiResponse("Access forbidden: Invalid token or insufficient permissions.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      setApiResponse(data.message); // Only show the message
    } catch (error: unknown) { // Type 'error' as 'unknown'
      console.error("Error sending data to API:", error);

      // Type assertion to 'Error' and access 'message' property
      if (error instanceof Error) {
        setApiResponse(`Error sending data to API: ${error.message}`);
      } else {
        setApiResponse("An unknown error occurred.");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <h1>Scan a Barcode</h1>
      <div id="qr-reader" style={{ margin: "0 auto", maxWidth: "500px" }}></div>
      <div style={{ marginTop: "16px" }}>
        <p><strong>Scanned Result:</strong> Lot Number: {lotNumber}, Bag Number: {bagNumber}</p>
        <p><strong>API Response:</strong> {apiResponse}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ScanBarcodePage;
