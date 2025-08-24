import { Button } from "blocksin-system";
import React, { useRef } from "react";

function FileExport({ canvas }) {
  const fileInputRef = useRef(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const exportCanvas = () => {
    if (!canvas) return;

    const json = canvas.toJSON();
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "canvas.json";
    link.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          canvas?.clear();
          canvas?.loadFromJSON(json);
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  return (
    <div className="FileExport">
      <Button variant="ghost" size="small" onClick={exportCanvas}>
        Export Canvas
      </Button>
      <Button variant="ghost" size="small" onClick={triggerFileSelect}>
        Upload Canvas
      </Button>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default FileExport;
