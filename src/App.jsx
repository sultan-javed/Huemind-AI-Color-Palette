import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [colors, setcolors] = useState([]);
  const [loading, setloading] = useState(false);

  const handlesubmit = async () => {
    setcolors([]);
    setloading(true);

    try {
      // now calling your own API route, no API key here
      const response = await axios.post("/api/colors", {
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: `Give me five hex colors for the color, mood or object: ${prompt}`,
          },
        ],
      });

      // response from your serverless function
      const result = response.data.choices[0].message.content;
      const hexmatches = result.match(/#[0-9a-fA-F]{6}/g);

      if (hexmatches) {
        setcolors(hexmatches);
      } else {
        setcolors([]);
        alert("No colors found. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setloading(false);
      setPrompt("");
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-purple-300 text-4xl sm:text-5xl font-thin mb-4 text-center">
        AI Color Palette
      </h1>
      <p className="text-gray-300 text-base sm:text-lg italic text-center max-w-xl">
        “Life is more colorful when you let your imagination paint it.”
      </p>
      <p className="text-gray-300 text-base sm:text-lg font-thin text-center max-w-xl mb-3">
        Find Your Shades with AI
      </p>

      {/* result */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-6 mt-16 mb-6 p-6 sm:p-10 md:p-16 lg:p-20 justify-center">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-24 sm:w-28 md:w-32 group"
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded transition-transform duration-300 group-hover:scale-130"
                style={{ backgroundColor: color }}
              ></div>
              <span className="mt-3 text-sm sm:text-base">{color}</span>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Describe a color, mood or object → I'll turn it into colors"
        className="w-full max-w-md p-3 mb-4 rounded-2xl text-black
         bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200
         focus:outline-none focus:ring-4 focus:ring-purple-400/60 
         placeholder-gray-600 shadow-md transition duration-300 text-sm sm:text-base"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="w-[140px] sm:w-[150px] h-[45px] sm:h-[50px] bg-black my-3 flex items-center justify-center rounded-xl cursor-pointer 
    relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
    hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full 
    before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
    before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff] text-sm sm:text-base"
        disabled={loading}
        onClick={handlesubmit}
      >
        {loading ? "Generating..." : "Get Your Color"}
      </button>
    </div>
  );
};

export default App;
