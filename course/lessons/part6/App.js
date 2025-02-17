import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import "./styles.scss";
import Settings from "./Settings";
import Video from "./Video";
import AddElements from "./AddElements";
import CanvasSettings from "./CanvasSettings";
import { handleObjectMoving, clearGuidelines } from "./snappingHelpers";
import Cropping from "./Cropping";
import CroppingSettings from "./CroppingSettings";

function CanvasComponent() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuidelines] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleFramesUpdated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="App">
      <div className="Toolbar darkmode">
        <Cropping canvas={canvas} onFramesUpdated={handleFramesUpdated} />
        <AddElements canvas={canvas} />
        <Video canvas={canvas} canvasRef={canvasRef} />
      </div>

      <canvas id="canvas" ref={canvasRef} />
      <div className="SettingsWrapper">
        <Settings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
        <CroppingSettings canvas={canvas} refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default CanvasComponent;
