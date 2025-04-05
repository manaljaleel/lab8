import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactForm.css";

const ContactForm = () => {
  const navigate = useNavigate();

  const initialFormData = {
    name: "",
    email: "",
    message: "",
    subject: "",
    consent: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "❌ Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "❌ Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "❌ Enter a valid email address.";
    }
    if (!formData.subject.trim()) newErrors.subject = "❌ Subject is required.";
    if (!formData.message.trim() || formData.message.length < 5)
      newErrors.message = "❌ Message must be at least 5 characters.";
    if (!formData.consent) newErrors.consent = "❌ You must agree to be contacted.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch("http://localhost:3000/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("✅ Message sent successfully!");
      setFormData(initialFormData);
    } else {
      alert("❌ " + data.error);
    }

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="contact-form-container">
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          {errors.subject && <p className="error-message">{errors.subject}</p>}
        </div>

        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          />
          <label>I consent to be contacted.</label>
          {errors.consent && <p className="error-message">{errors.consent}</p>}
        </div>

        <button type="submit">Send Message</button>
      </form>
      <button onClick={() => navigate("/messages")} className="view-messages-btn">
        📩 View Messages
      </button>
    </div>
  );
};

export default ContactForm;
