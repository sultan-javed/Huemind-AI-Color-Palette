// api/colors.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // take body from frontend
    const body = req.body;

    // enforce safe defaults
    const requestData = {
      ...body,
      max_tokens: body.max_tokens || 500, 
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
}
