import React, { useState } from "react";
import { Flex } from "blocksin-system";

function Presets({ canvas }) {
  const [presets, setpresets] = useState([
    {
      color: "#508684",
      fontSize: 32,
      fontFamily: "Arial",
      textAlign: "center",
      letterSpacing: 4,
      underline: true,
      id: "001",
    },
    {
      color: "#FFD02F",
      fontSize: 26,
      fontFamily: "Open Sans",
      textAlign: "right",
      letterSpacing: 2,
      underline: false,
      id: "002",
    },
  ]);

  const applyStyle = (
    color,
    fontSize,
    fontFamily,
    letterSpacing,
    textAlign,
    underline,
    id
  ) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      activeObject.set("fontSize", fontSize);
      activeObject.set("fontFamily", fontFamily);
      activeObject.set("textAlign", textAlign);
      const charSpacing = (letterSpacing * 1000) / fontSize;
      activeObject.set("charSpacing", charSpacing);
      activeObject.set("underline", underline);
      activeObject.set("styleID", id);
      canvas.renderAll();
    }
  };

  return (
    <>
      <Flex direction="column" className="StyleEditor CanvasSettings darkmode">
        <Flex wrap="wrap" fluid gap={100}>
          {presets.map(
            ({
              id,
              color,
              fontFamily,
              fontSize,
              letterSpacing,
              textAlign,
              underline,
            }) => (
              <div
                key={id}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                }}
                onClick={() =>
                  applyStyle(
                    color,
                    fontSize,
                    fontFamily,
                    letterSpacing,
                    textAlign,
                    underline,
                    id
                  )
                }
              >
                <span
                  style={{
                    pointerEvents: "none",
                    display: "block",
                    fontSize: fontSize,
                    fontFamily: fontFamily,
                    color: color,
                    width: "100%",
                    textAlign: textAlign,
                    letterSpacing: letterSpacing,
                    textDecoration: underline ? "underline" : "none",
                  }}
                >
                  Apply
                </span>
              </div>
            )
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default Presets;
