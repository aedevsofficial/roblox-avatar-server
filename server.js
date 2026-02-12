import express from "express";
import fetch from "node-fetch";

const app = express();

// Allow CORS so your HTML can fetch from anywhere
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to fetch Roblox avatar by user ID
app.get("/avatar/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );
    const data = await response.json();

    if (!data.data || !data.data[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// ⚠ Use process.env.PORT provided by Cloud Run
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
