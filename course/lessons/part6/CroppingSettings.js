import React, { useState, useEffect } from "react";
import { Button, Select } from "blocksin-system";
import { DownloadIcon } from "sebikostudio-icons";

function CroppingSettings({ canvas, refreshKey }) {
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const updateFrames = () => {
    if (canvas) {
      const framesFromCanvas = canvas.getObjects("rect").filter((obj) => {
        return obj.name && obj.name.startsWith("Frame");
      });

      console.log("Filtered frames loaded from canvas:", framesFromCanvas);

      setFrames(framesFromCanvas);
      if (framesFromCanvas.length > 0) {
        setSelectedFrame(framesFromCanvas[0]);
      }
    }
  };

  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]);

  const handleFrameSelect = (value) => {
    const selected = frames.find((frame) => frame.name === value);
    setSelectedFrame(selected);
    canvas.setActiveObject(selected);
    canvas.renderAll();
  };

  const exportFrameAsPNG = () => {
    if (!selectedFrame) return;

    // Temporarily hide all frames for the export
    frames.forEach((frame) => {
      frame.set("visible", false);
    });

    selectedFrame.set({
      strokeWidth: 0,
      visible: true, // Ensure the selected frame is visible during export
    });

    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: "png",
    });

    // Restore the dashed line and visibility after exporting
    selectedFrame.set({
      strokeWidth: 1,
    });

    frames.forEach((frame) => {
      frame.set("visible", true);
    });

    canvas.renderAll();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${selectedFrame.name}.png`;
    link.click();
  };

  return (
    <div className="CanvasSettings darkmode">
      {frames.length > 0 && (
        <>
          <Select
            value={selectedFrame?.name || ""}
            onValueChange={handleFrameSelect}
          >
            <Select.Trigger aria-label="Frames">
              <Select.Value placeholder="Select a frame" />
            </Select.Trigger>
            <Select.Content side="bottom" sideOffset={8} align="start">
              {frames.map((frame, index) => (
                <Select.Item key={index} value={frame.name}>
                  {frame.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Button fluid variant="solid" onClick={exportFrameAsPNG}>
            <DownloadIcon /> Export as PNG
          </Button>
        </>
      )}
    </div>
  );
}

export default CroppingSettings;
