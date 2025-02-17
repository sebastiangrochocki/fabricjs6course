import React from "react";
import { Rect, Circle } from "fabric";
import { IconButton } from "blocksin-system";
import { SquareIcon, CircleIcon } from "sebikostudio-icons";

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

  return (
    <>
      <IconButton onClick={addRectangle} variant="ghost" size="medium">
        <SquareIcon />
      </IconButton>
      <IconButton onClick={addCircle} variant="ghost" size="medium">
        <CircleIcon />
      </IconButton>
    </>
  );
}

export default AddElements;
