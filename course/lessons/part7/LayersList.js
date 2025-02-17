import React, { useEffect, useState } from "react";
import { Canvas } from "fabric";

function LayersList({ canvas }) {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  // Add unique id based on the date and object type/name if it doesn't exist
  const addIdToObject = (object) => {
    if (!object.id) {
      const timestamp = new Date().getTime(); // Get current timestamp
      object.id = `${object.type}_${timestamp}`; // Create unique id using type and timestamp
    }
  };

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      ensureObjectHasId(obj); // Ensure each object has a unique ID
      obj.zIndex = index;
    });
  };

  // Function to update the layers list
  const updateLayers = () => {
    if (canvas) {
      canvas.updateZIndices();
      const objects = canvas
        .getObjects()
        .filter(
          (obj) =>
            !(
              obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-")
            )
        ) // Exclude objects starting with "vertical-" or "horizontal-"
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
        }));
      setLayers([...objects].reverse()); // Reverse to show top layers first
    }
  };

  // Handle canvas object selection
  const handleObjectSelected = (e) => {
    const selectedObject = e.selected ? e.selected[0] : null;

    if (selectedObject) {
      setSelectedLayer(selectedObject.id); // Set the selected layer based on object ID
    } else {
      setSelectedLayer(null); // Clear selection if no object is selected
    }
  };

  // Select layer from LayersList and activate it in canvas
  const selectLayerInCanvas = (layerId) => {
    const object = canvas.getObjects().find((obj) => obj.id === layerId);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (canvas) {
      // Update layers on canvas changes
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      // Listen to object selection on canvas
      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => setSelectedLayer(null)); // Clear selection when nothing is selected

      // Initial update
      updateLayers();

      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);
        canvas.off("selection:created", handleObjectSelected);
        canvas.off("selection:updated", handleObjectSelected);
        canvas.off("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canvas]);

  return (
    <div className="layersList CanvasSettings darkmode">
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            onClick={() => selectLayerInCanvas(layer.id)}
            className={layer.id === selectedLayer ? "selected-layer" : ""}
          >
            {layer.type} ({layer.zIndex})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LayersList;
