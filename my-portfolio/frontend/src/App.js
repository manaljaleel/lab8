import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import Messages from "./components/Messages";
import "./styles.css";

function App() {
  // Get the current theme from localStorage, default to "light" if not found
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Function to toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"; // Toggle theme
    setTheme(newTheme); // Update the state with the new theme
    localStorage.setItem("theme", newTheme); // Save the theme to localStorage
  };

  // Apply the current theme as a class to the body element when theme changes
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className={`app ${theme}`}>
        {/* Header with theme toggle */}
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>

        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
