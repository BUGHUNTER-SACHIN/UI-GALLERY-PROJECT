import React from 'react';
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const mailtoLink = `mailto:Support.aetherGallery1@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`)}`;
    window.location.href = mailtoLink;
    toast.success("Opening your email client...");
    setSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-6xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6" }, "Get In Touch"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto" }, "Have questions or feedback? We'd love to hear from you.")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-12" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: 0.2 },
      className: "glass-card p-8"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-white mb-6" }, "Send a Message"),
    /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { htmlFor: "name", className: "text-gray-400" }, "Name"), /* @__PURE__ */ React.createElement(
      Input,
      {
        id: "name",
        name: "name",
        value: formData.name,
        onChange: handleChange,
        required: true,
        className: "mt-2 bg-white/5 border-white/10",
        placeholder: "Your name"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { htmlFor: "email", className: "text-gray-400" }, "Email"), /* @__PURE__ */ React.createElement(
      Input,
      {
        id: "email",
        name: "email",
        type: "email",
        value: formData.email,
        onChange: handleChange,
        required: true,
        className: "mt-2 bg-white/5 border-white/10",
        placeholder: "your@email.com"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { htmlFor: "subject", className: "text-gray-400" }, "Subject"), /* @__PURE__ */ React.createElement(
      Input,
      {
        id: "subject",
        name: "subject",
        value: formData.subject,
        onChange: handleChange,
        required: true,
        className: "mt-2 bg-white/5 border-white/10",
        placeholder: "What's this about?"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { htmlFor: "message", className: "text-gray-400" }, "Message"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        id: "message",
        name: "message",
        value: formData.message,
        onChange: handleChange,
        required: true,
        rows: 5,
        className: "mt-2 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500",
        placeholder: "Your message..."
      }
    )), /* @__PURE__ */ React.createElement(
      Button,
      {
        type: "submit",
        disabled: submitting,
        className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6"
      },
      submitting ? "Sending..." : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { className: "w-4 h-4 mr-2" }), "Send Message")
    ))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: 0.3 },
      className: "space-y-8"
    },
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-white mb-6" }, "Contact Information"), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(Mail, { className: "w-6 h-6 text-purple-400" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-white mb-1" }, "Email"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "Support.aetherGallery1@gmail.com"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-lg bg-pink-600/20 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(Phone, { className: "w-6 h-6 text-pink-400" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-white mb-1" }, "Phone"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "+91 98765 43210"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-6 h-6 text-blue-400" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-white mb-1" }, "Location"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "Whitefield, Banglore, India"))))),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-white mb-6" }, "Follow Us"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ React.createElement(
      motion.a,
      {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        href: "#",
        className: "w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
      },
      /* @__PURE__ */ React.createElement(Github, { className: "w-6 h-6 text-gray-400" })
    ), /* @__PURE__ */ React.createElement(
      motion.a,
      {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        href: "#",
        className: "w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
      },
      /* @__PURE__ */ React.createElement(Twitter, { className: "w-6 h-6 text-gray-400" })
    ), /* @__PURE__ */ React.createElement(
      motion.a,
      {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        href: "#",
        className: "w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
      },
      /* @__PURE__ */ React.createElement(Linkedin, { className: "w-6 h-6 text-gray-400" })
    )))
  )));
}
