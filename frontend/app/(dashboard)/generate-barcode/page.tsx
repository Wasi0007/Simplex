"use client";

import { useState } from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import { Canvg } from "canvg";
import { useRouter } from "next/navigation";

const GenerateBarcode = () => {
  const [lotNumber, setLotNumber] = useState("");
  const [bagNumber, setBagNumber] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();
  

  const generatePDF = async (barcodeStrings: string[]) => {
    console.log("Starting PDF generation...");
  
    const pdf = new jsPDF();
    let yOffset = 10;
    let xOffset = 10; // Starting position for the first column
  
    const barcodeWidth = 40; // Barcode width in PDF
    const barcodeHeight = 30; // Barcode height to fit more barcodes
  
    const maxY = 285; // Max Y offset for content (max available space, reduced for printing)
    const columnSpacing = 10; // Reduced space between columns
    const columnWidth = barcodeWidth + columnSpacing; // Width for each column
  
    const columnsPerRow = 3; // Number of columns per row
    const maxX = columnWidth * columnsPerRow; // Max X offset for three columns
  
    for (const barcode of barcodeStrings) {
      console.log("Creating barcode:", barcode);
  
      const svg = document.createElement("svg");
  
      // Generate the barcode with reduced width and height
      JsBarcode(svg, barcode, {
        width: 1, // Barcode width for higher resolution
        height: barcodeHeight, // Reduced barcode height
        displayValue: false,
      });
  
      // Serialize the SVG to a string
      let svgData = new XMLSerializer().serializeToString(svg);
  
      console.log("Serialized SVG data:");
      console.log(svgData);
  
      // Remove the conflicting xmlns="http://www.w3.org/1999/xhtml" attribute
      svgData = svgData.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "");
  
      // Ensure only one xmlns attribute is present (the SVG one)
      if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgData = `<svg xmlns="http://www.w3.org/2000/svg">${svgData}</svg>`;
      }
  
      try {
        // Create a canvas to render the SVG
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          console.error("Canvas context could not be created.");
          return;
        }
  
        // Set the canvas size to the barcode size for better resolution
        const canvasWidth = 150; // Width adjusted to barcode size
        const canvasHeight = barcodeHeight; // Height adjusted for better resolution
  
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
  
        // Use Canvg to render the SVG onto the canvas
        const canvgInstance = await Canvg.from(ctx, svgData);
        await canvgInstance.render();
  
        // Convert the canvas content to a base64 image
        const imgData = canvas.toDataURL("image/png");
  
        // Print the barcode image to the console (for debugging)
        console.log("Generated barcode image data URL:", imgData);
  
        // Add the barcode image to the PDF with smaller dimensions
        pdf.addImage(imgData, "PNG", xOffset, yOffset, barcodeWidth, barcodeHeight); // Add to PDF
  
        // Adjust yOffset for the next barcode
        yOffset += barcodeHeight + 5; // Adjust spacing between barcodes
  
        // If the yOffset reaches the max value, move to the next column
        if (yOffset > maxY) {
          yOffset = 10; // Reset yOffset for the next row
          xOffset += columnWidth; // Move to the next column
  
          // If all columns are filled, create a new page and reset the layout
          if (xOffset >= maxX) {
            pdf.addPage();
            yOffset = 10;
            xOffset = 10; // Reset to the first column on the new page
          }
        }
      } catch (error) {
        console.error("Error rendering SVG to canvas:", error);
        return;
      }
    }
  
    console.log("PDF generation complete.");
    pdf.save("barcodes.pdf");
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputData = {
      lotNumber: parseInt(lotNumber, 10),
      bagNumber: parseInt(bagNumber, 10),
      Date: new Date(date).getTime(),
    };

    console.log("Input Data:", inputData);

    if (!lotNumber || !bagNumber || !date) {
      alert("Please fill all the fields!");
      return;
    }

    // Make the API request first
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      console.log("Sending data to backend...");
      const response = await fetch("http://localhost:8081/api/v1/bag/scanIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inputData),
      });

      const responseData = await response.json();
      console.log("Backend Response:", responseData);

      if (response.ok && responseData.message === "Successfully scanned in bags") {
        alert("Success: " + responseData.message);

        // If the response message is "Successfully scanned in bags", generate barcodes
        const barcodeStrings: string[] = [];
        for (let i = 1; i <= inputData.bagNumber; i++) {
          const barcode = `A-${inputData.lotNumber}_${i}-Z`;
          barcodeStrings.push(barcode);
        }

        console.log("Generated Barcodes:", barcodeStrings);

        // Generate the PDF with barcodes
        await generatePDF(barcodeStrings);
      } else {
        alert("Error: " + (responseData.message || "Something went wrong."));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the data.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Barcode</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="lotNumber" className="block text-sm font-medium text-gray-700">
              Lot Number
            </label>
            <input
              type="text"
              id="lotNumber"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="bagNumber" className="block text-sm font-medium text-gray-700">
              Bag Number
            </label>
            <input
              type="text"
              id="bagNumber"
              value={bagNumber}
              onChange={(e) => setBagNumber(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md">
            Submit
          </button>
        </div>
      </form>
      <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Back to Dashboard
        </button>
    </div>
  );
};

export default GenerateBarcode;
