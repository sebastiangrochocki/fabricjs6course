import React, { useState, useEffect } from "react";
import { Input } from "blocksin-system";

function CanvasSettings({ canvas }) {
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasWidth, canvasHeight, canvas]);

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    if (intValue >= 0) {
      setCanvasWidth(intValue);
    }
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    if (intValue >= 0) {
      setCanvasHeight(intValue);
    }
  };

  return (
    <div className="CanvasSettings darkmode">
      <Input
        fluid
        label="Canvas Width"
        value={canvasWidth}
        onChange={handleWidthChange}
      />
      <Input
        fluid
        label="Canvas Height"
        value={canvasHeight}
        onChange={handleHeightChange}
      />
    </div>
  );
}

export default CanvasSettings;
