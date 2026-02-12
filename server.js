const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

// Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Fetch Roblox avatar JSON
app.get("/avatar/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );
    const data = await response.json();

    // Check if API returned data
    if (!data.data || !data.data[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the JSON
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
