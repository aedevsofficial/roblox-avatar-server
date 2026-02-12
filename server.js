import express from "express";
import fetch from "node-fetch";

const app = express();

// Allow CORS so your frontend can fetch
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint to fetch Roblox avatar by username
app.get("/avatar/:username", async (req, res) => {
  const username = req.params.username;

  try {
    // Step 1: Convert username → userId
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    });

    const userData = await userRes.json();
    if (!userData.data || !userData.data[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData.data[0].id;

    // Step 2: Fetch avatar using userId
    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const avatarData = await avatarRes.json();
    if (!avatarData.data || !avatarData.data[0]) {
      return res.status(404).json({ error: "Avatar not found" });
    }

    // Return avatar JSON
    res.json(avatarData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// Use PORT provided by Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
