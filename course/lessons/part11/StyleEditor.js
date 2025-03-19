import { Button, Flex, Heading, Paragraph, Separator } from "blocksin-system";
import React, { useState, useEffect, useRef } from "react";

function StyleEditor({ canvas }) {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("#000000");
  const colorInputRef = useRef(null);

  useEffect(() => {
    const savedStyles = JSON.parse(localStorage.getItem("canvasStyles")) || [];
    setColors(savedStyles);
  }, []);

  const addColor = () => {
    const id = `color${Date.now()}`;
    const updatedColors = [...colors, { id, color: newColor }];
    setColors(updatedColors);
    console.log(colors);
  };

  const saveColors = () => {
    localStorage.setItem("canvasStyles", JSON.stringify(colors));

    // Loop through all objects on the canvas and check their styleID
    canvas?.getObjects().forEach((object) => {
      const objectStyleID = object.get("styleID");
      const colorToUpdate = colors.find((color) => color.id === objectStyleID);

      if (colorToUpdate && object.get("fill") !== colorToUpdate.color) {
        object.set("fill", colorToUpdate.color);
      }
    });

    // Re-render the canvas to apply updated colors
    canvas.renderAll();
  };

  const applyStyle = (color, id) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      activeObject.set("styleID", id);
      canvas.renderAll();
    }
  };

  const updateColor = (id, newColor) => {
    const updatedColors = colors.map((item) =>
      item.id === id ? { ...item, color: newColor } : item
    );
    setColors(updatedColors);
  };

  // Trigger color input on div click
  const openColorPicker = () => {
    colorInputRef.current.click();
  };

  const openColorPickerById = (id) => {
    document.getElementById(`color-${id}`).click();
  };

  return (
    <Flex direction="column" className="StyleEditor CanvasSettings darkmode">
      <input
        ref={colorInputRef}
        type="color"
        value={newColor}
        onChange={(e) => setNewColor(e.target.value)}
        style={{ pointerEvents: "none", opacity: 0, width: 0, height: 0 }}
      />
      <Heading level={4} weight="bold">
        Style Editor
      </Heading>
      <Flex fluid gap={100}>
        {/* Clickable Div to Open Color Picker */}
        <div
          onClick={openColorPicker}
          style={{
            backgroundColor: newColor,
          }}
          className="colorBox"
        />
        <Button size="small" variant="outline" onClick={addColor}>
          Add Color
        </Button>
      </Flex>
      <Separator />
      <Heading level={4} weight="bold">
        Styles
      </Heading>
      <Flex wrap="wrap" gap={100}>
        {colors.map(({ id, color }) => (
          <div
            key={id}
            style={{
              backgroundColor: color,
            }}
            onClick={() => applyStyle(color, id)}
            className="colorBox"
          >
            Apply
          </div>
        ))}
      </Flex>
      <Separator />
      <Heading level={4} weight="bold">
        Edit Colors
      </Heading>
      <Flex direction="column" gap={100} className="ColorList">
        {colors.map(({ id, color }) => (
          <Flex key={id} align="center">
            <input
              id={`color-${id}`}
              style={{
                pointerEvents: "none",
                opacity: 0,
                width: 0,
                height: 0,
              }}
              type="color"
              value={color}
              onChange={(e) => updateColor(id, e.target.value)}
            />
            <Flex gap={100} align="center">
              <div
                onClick={() => openColorPickerById(id)}
                className="colorBox"
                style={{
                  backgroundColor: color,
                }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(id, e.target.value)}
              />
              <Paragraph size="small">{id}</Paragraph>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Separator />
      <Button size="small" fluid onClick={saveColors}>
        Save
      </Button>
    </Flex>
  );
}

export default StyleEditor;
