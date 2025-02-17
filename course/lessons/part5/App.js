import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import "./styles.scss";
import Settings from "./Settings";
import Video from "./Video";
import AddElements from "./AddElements";
import CanvasSettings from "./CanvasSettings";
import { handleObjectMoving, clearGuidelines } from "./snappingHelpers";

function CanvasComponent() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      initCanvas.on("object:moving", (event) =>
        handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines)
      );

      initCanvas.on("object:modified", () =>
        clearGuidelines(initCanvas, guidelines, setGuidelines)
      );

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <div className="App">
      <div className="Toolbar darkmode">
        <AddElements canvas={canvas} />
        <Video canvas={canvas} canvasRef={canvasRef} />
      </div>

      <canvas id="canvas" ref={canvasRef} />
      <div className="SettingsWrapper">
        <Settings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
      </div>
    </div>
  );
}

export default CanvasComponent;
