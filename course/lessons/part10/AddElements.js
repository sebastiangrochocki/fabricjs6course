import React from "react";
import { Rect, Circle, Textbox } from "fabric";
import { IconButton } from "blocksin-system";
import { SquareIcon, CircleIcon, TextIcon } from "sebikostudio-icons";

function AddElements({ canvas }) {
  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#D84D42",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#2F4DC6",
      });
      canvas.add(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const textbox = new Textbox("My Text", {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 20,
        fill: "#333",
        lockScalingFlip: true,
        lockScalingX: false,
        lockScalingY: false,
        editable: true,
        fontFamily: "OpenSans",
        textAlign: "left",
      });
      canvas.add(textbox);
    }
  };

  return (
    <>
      <IconButton onClick={addRectangle} variant="ghost" size="medium">
        <SquareIcon />
      </IconButton>
      <IconButton onClick={addCircle} variant="ghost" size="medium">
        <CircleIcon />
      </IconButton>
      <IconButton onClick={addText} variant="ghost" size="medium">
        <TextIcon />
      </IconButton>
    </>
  );
}

export default AddElements;
