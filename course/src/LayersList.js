import React, { useEffect, useState } from "react";
import { Canvas } from "fabric";
import { IconButton, Flex } from "blocksin-system";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "sebikostudio-icons";

function LayersList({ canvas }) {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  const hideSelectedLayer = () => {
    if (!selectedLayer) return;

    const object = canvas
      .getObjects()
      .find((obj) => obj.id === selectedLayer.id);
    if (!object) return;

    if (object.opacity === 0) {
      object.opacity = object.prevOpacity || 1;
      object.prevOpacity = undefined;
    } else {
      object.prevOpacity = object.opacity || 1;
      object.opacity = 0;
    }

    canvas.renderAll();
    updateLayers();

    setSelectedLayer({ ...selectedLayer, opacity: object.opacity });
  };

  // Add unique id based on the date and object type/name if it doesn't exist
  const ensureObjectHasId = (object) => {
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
          opacity: obj.opacity,
        }));
      setLayers([...objects].reverse()); // Reverse to show top layers first
    }
  };

  // Move selected layer up or down using Fabric.js native methods
  const moveSelectedLayer = (direction) => {
    if (!selectedLayer) return; // If no layer is selected, do nothing

    const objects = canvas.getObjects();
    const object = objects.find((obj) => obj.id === selectedLayer.id);

    if (object) {
      const currentIndex = objects.indexOf(object);

      // Move object up in the stack
      if (direction === "up" && currentIndex < objects.length - 1) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex + 1];
        objects[currentIndex + 1] = temp;
      }
      // Move object down in the stack
      else if (direction === "down" && currentIndex > 0) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex - 1];
        objects[currentIndex - 1] = temp;
      }

      // Save the background color before clearing the canvas
      const backgroundColor = canvas.backgroundColor;

      // Clear the canvas and re-add the objects in the new order
      canvas.clear();
      objects.forEach((obj) => canvas.add(obj));

      // Restore the background color
      canvas.backgroundColor = backgroundColor;

      // Re-render the canvas
      canvas.renderAll();

      // Update zIndex for all objects based on their position in the array
      objects.forEach((obj, index) => {
        obj.zIndex = index;
      });

      // Set the active object again to keep the selection active
      canvas.setActiveObject(object);

      // Re-render again after setting the active object
      canvas.renderAll();

      updateLayers(); // Update the layers list to reflect the new order
    }
  };

  // Handle canvas object selection
  const handleObjectSelected = (e) => {
    const selectedObject = e.selected ? e.selected[0] : null;

    if (selectedObject) {
      setSelectedLayer({
        id: selectedObject.id,
        opacity: selectedObject.opacity,
      }); // Set the selected layer based on object ID
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

      setSelectedLayer({
        id: object.id,
        opacity: object.opacity,
      });
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
      <Flex fluid justify="start" style={{ marginBottom: "16px" }} gap={100}>
        <IconButton
          size="small"
          onClick={() => moveSelectedLayer("up")}
          disabled={!selectedLayer || layers[0]?.id === selectedLayer.id} // Disable if no layer is selected or it's the top layer
        >
          <ArrowUpIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => moveSelectedLayer("down")}
          disabled={
            !selectedLayer || layers[layers.length - 1]?.id === selectedLayer.id
          } // Disable if no layer is selected or it's the bottom layer
        >
          <ArrowDownIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={hideSelectedLayer}
          disabled={!selectedLayer}
        >
          {selectedLayer?.opacity === 0 ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </IconButton>
      </Flex>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            onClick={() => selectLayerInCanvas(layer.id)}
            className={layer.id === selectedLayer?.id ? "selected-layer" : ""}
          >
            {layer.type} ({layer.zIndex})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LayersList;
