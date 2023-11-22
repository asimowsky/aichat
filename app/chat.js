"use client";
import { useChat } from "ai/react";
import "./globals.css";
import React, { useEffect } from "react";
import Image from "next/image";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });
  const query = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/SimianLuo/LCM_Dreamshaper_v7",
      {
        headers: {
          Authorization: "Bearer " + process.env.HUGGINGFACE_API_KEY,
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-x-hidden overflow-y-scroll bg-dark">
          <ul className="p-4">
            {messages.map((m, index) => (
              <li
                key={index}
                className={`flex items-end ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } my-3`}
              >
                {m.role === "user" ? (
                  <div className="hidden md:block justify-end">
                    {/* AI Profile picture on the left */}
                    <Image
                      src="/monkey.png"
                      alt="AI Profile"
                      className="w-8 h-8 rounded-full mr-2"
                      width={100}
                      height={100}
                    />
                  </div>
                ) : (
                  <Image
                    src="/ai_profile.png"
                    alt="AI Profile"
                    className="w-8 h-8 rounded-full mr-2"
                    width={100}
                    height={100}
                  />
                )}

                {/* Message bubble */}
                <div
                  className={`max-w-xs p-4 rounded-lg ${
                    m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-600"
                  } my-3 `}
                >
                  {m.content}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Message input form */}
        <form onSubmit={handleSubmit} className="bg-gray-200 p-4 flex">
          <input
            value={input}
            onChange={handleInputChange}
            className="ml-2 p-2 border rounded-md flex-1 w-full"
            style={{ color: "black" }}
          />

          <button
            type="submit"
            className="ml-2 p-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
