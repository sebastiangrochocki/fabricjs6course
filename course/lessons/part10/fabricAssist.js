import React, { useState } from "react";
import axios from "axios";
import { Textbox } from "fabric";
import { Input, Button, Flex } from "blocksin-system";

function FabricAssist({ canvas }) {
  const [inputText, setInputText] = useState("");

  const handleGenerate = async () => {
    console.log("Input Text:", inputText); // Log the input text for debugging

    if (!inputText) {
      console.error("Input text is empty.");
      return; // Prevent the request if inputText is empty
    }

    try {
      const response = await axios.post("http://localhost:3000/generate-text", {
        text: inputText,
      });
      const openAIResponse = response.data.generatedText;

      const textObj = new Textbox(openAIResponse, {
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

      canvas.add(textObj);
      canvas.renderAll();
    } catch (error) {
      console.error("Error generating text:", error);
    }
  };

  return (
    <Flex className="AI" gap={100}>
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter query for Fabric Assist"
        label="Fabric Assist"
      />
      <Button onClick={handleGenerate}>Generate</Button>
    </Flex>
  );
}

export default FabricAssist;
