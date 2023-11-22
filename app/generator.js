"use client";
import Image from "next/image";
import React, { useState } from "react";

const API_TOKEN = "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";

const ImageGenerationForm = () => {
  const [output, setOutput] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const input = event.target.elements.input.value;
    setPrompt(input);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Norod78/sdxl-PaperCutouts-Dreambooth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ inputs: input }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      setOutput(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = output;
    link.download = "art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="w-full  flex text-center items-center justify-center p-3 ">
        <Image
          src={"/ai_profile.png"}
          width={70}
          height={70}
          style={{ borderRadius: "50%" }}
        />
      </div>

      <div className="text-center flex flex-col justify-center align-middle">
        <h2 className="text-3xl font-extrabold text-blue-100 mb-2">
          Generate Your Creativity!
        </h2>
      </div>
      <form
        className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="input"
          className="w-full border border-gray-300 p-2 mb-4 rounded-md text-black"
          placeholder="Type your prompt here..."
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {output && (
        <div className="mt-8 flex justify-center">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="result-image">
              <Image
                width={300}
                height={500}
                src={output}
                alt="art"
                className="rounded-md"
              />
              <div className="mt-4 text-center">
                <button
                  onClick={handleDownload}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Download
                </button>
                {/* {user && <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">Share</button>} */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerationForm;
