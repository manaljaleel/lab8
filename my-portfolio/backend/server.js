const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File Paths
const projectsFile = path.join(__dirname, "projects.json");
const messagesFile = path.join(__dirname, "messages.json");

// Function to sanitize input
const sanitizeInput = (input) => input.replace(/<[^>]*>?/gm, "").trim();

// 📌 API Route: Fetch Projects
app.get("/api/projects", (req, res) => {
  fs.readFile(projectsFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading projects file:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const projects = JSON.parse(data);
      if (!projects || projects.length === 0) return res.status(404).json({ error: "No projects found" });

      res.json(projects);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

// 📌 API Route: Fetch All Messages
app.get("/api/messages", (req, res) => {
  fs.readFile(messagesFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading messages file:", err);
      return res.status(500).json({ error: "Failed to read messages." });
    }

    try {
      const messages = JSON.parse(data);
      res.status(200).json(messages);
    } catch (err) {
      console.error("Error parsing messages JSON:", err);
      res.status(500).json({ error: "Invalid messages format." });
    }
  });
});

// 📌 API Route: Handle Contact Form Submission
app.post("/submit-form", (req, res) => {
  let { name, email, subject, message } = req.body;

  // Sanitize inputs
  name = sanitizeInput(name);
  email = sanitizeInput(email);
  subject = sanitizeInput(subject);
  message = sanitizeInput(message);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = { name, email, subject, message, date: new Date().toISOString() };

  // Read existing messages and update
  fs.readFile(messagesFile, "utf8", (err, data) => {
    let messages = [];
    if (!err && data) {
      messages = JSON.parse(data);
    }

    messages.push(newMessage);

    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save message." });
      }
      res.status(200).json({ message: "Message received successfully!" });
    });
  });
});

// 📌 Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 📌 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
