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

    // Toggle opacity and store the original opacity once
    if (object.opacity === 0) {
      object.opacity = object.prevOpacity || 1;
      object.prevOpacity = undefined; // Clear `prevOpacity` after restoring
    } else {
      object.prevOpacity = object.opacity || 1; // Store original opacity
      object.opacity = 0;
    }

    canvas.renderAll();
    updateLayers();
    setSelectedLayer({ ...selectedLayer, opacity: object.opacity });
  };

  const moveSelectedLayer = (direction) => {
    if (!selectedLayer) return;

    const objects = canvas.getObjects();
    const object = objects.find((obj) => obj.id === selectedLayer.id);

    if (object) {
      const currentIndex = objects.indexOf(object);

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

      const backgroundColor = canvas.backgroundColor;
      canvas.clear();

      objects.forEach((obj) => canvas.add(obj));
      canvas.backgroundColor = backgroundColor;
      canvas.renderAll();

      objects.forEach((obj, index) => {
        obj.zIndex = index;
      });

      canvas.setActiveObject(object);
      canvas.renderAll();

      updateLayers();
    }
  };

  const addIdToObject = (object) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}_${timestamp}`;
    }
  };

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

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
        )
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          opacity: obj.opacity,
        }));
      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelected = (e) => {
    const selectedObject = e.selected ? e.selected[0] : null;

    if (selectedObject) {
      setSelectedLayer({
        id: selectedObject.id,
        opacity: selectedObject.opacity,
      });
    } else {
      setSelectedLayer(null);
    }
  };

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
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", () => setSelectedLayer(null));

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
      <Flex fluid justify="start" style={{ marginBottom: 16 }} gap={100}>
        <IconButton
          size="small"
          onClick={() => moveSelectedLayer("up")}
          disabled={!selectedLayer || layers[0]?.id === selectedLayer.id}
        >
          <ArrowUpIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => moveSelectedLayer("down")}
          disabled={
            !selectedLayer || layers[layers.length - 1]?.id === selectedLayer.id
          }
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
