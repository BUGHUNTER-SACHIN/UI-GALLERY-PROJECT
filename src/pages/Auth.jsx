import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Lock, Mail, ArrowRight, Users, Trash2 } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const accounts = localStorage.getItem("saved_accounts");
    if (accounts) {
      setSavedAccounts(JSON.parse(accounts));
    }
  }, []);
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/gallery");
    }
  }, [user, authLoading, navigate]);
  const saveAccount = (email2) => {
    const newAccount = {
      email: email2,
      lastUsed: Date.now()
    };
    const existing = savedAccounts.filter((acc) => acc.email !== email2);
    const updated = [newAccount, ...existing].slice(0, 5);
    setSavedAccounts(updated);
    localStorage.setItem("saved_accounts", JSON.stringify(updated));
  };
  const removeAccount = (email2) => {
    const updated = savedAccounts.filter((acc) => acc.email !== email2);
    setSavedAccounts(updated);
    localStorage.setItem("saved_accounts", JSON.stringify(updated));
    toast.success("Account removed from list");
  };
  const selectAccount = (accountEmail) => {
    setEmail(accountEmail);
    setShowAccountSwitcher(false);
    toast.info(`Selected ${accountEmail}`);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        saveAccount(email);
        toast.success("Logged in successfully!");
      } else {
        await signUp(email, password);
        saveAccount(email);
        toast.success("Account created successfully!");
      }
      navigate("/gallery");
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  if (authLoading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center" }, /* @__PURE__ */ React.createElement(AnimatedBackground, null), /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" }));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center p-4 relative overflow-hidden" }, /* @__PURE__ */ React.createElement(AnimatedBackground, null), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "w-full max-w-md relative z-10"
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center mb-8"
      },
      /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-2" }, "AetherGallery"),
      /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "Your creative cloud platform")
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        layout: true,
        className: "backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-6 bg-white/5 p-1 rounded-xl" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setIsLogin(true),
          className: `flex-1 py-3 rounded-lg font-medium transition-all ${isLogin ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`
        },
        "Sign In"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setIsLogin(false),
          className: `flex-1 py-3 rounded-lg font-medium transition-all ${!isLogin ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`
        },
        "Sign Up"
      )),
      savedAccounts.length > 0 && /* @__PURE__ */ React.createElement(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "w-full mb-4 border-white/20 hover:bg-white/10",
          onClick: () => setShowAccountSwitcher(!showAccountSwitcher)
        },
        /* @__PURE__ */ React.createElement(Users, { className: "w-4 h-4 mr-2" }),
        "Switch Account (",
        savedAccounts.length,
        ")"
      ),
      /* @__PURE__ */ React.createElement(AnimatePresence, null, showAccountSwitcher && /* @__PURE__ */ React.createElement(
        motion.div,
        {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          exit: { opacity: 0, height: 0 },
          className: "mb-4 space-y-2 overflow-hidden"
        },
        savedAccounts.map((account) => /* @__PURE__ */ React.createElement(
          motion.div,
          {
            key: account.email,
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            className: "flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
          },
          /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => selectAccount(account.email),
              className: "flex-1 flex items-center gap-2 text-left"
            },
            /* @__PURE__ */ React.createElement(User, { className: "w-4 h-4 text-purple-400" }),
            /* @__PURE__ */ React.createElement("span", { className: "text-sm text-white" }, account.email)
          ),
          /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => removeAccount(account.email),
              className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
            },
            /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4 text-red-400" })
          )
        ))
      )),
      /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm text-gray-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Mail, { className: "w-4 h-4" }), "Email"), /* @__PURE__ */ React.createElement(
        Input,
        {
          type: "email",
          placeholder: "your@email.com",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          required: true,
          className: "bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm text-gray-400 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4" }), "Password"), /* @__PURE__ */ React.createElement(
        Input,
        {
          type: "password",
          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true,
          className: "bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
        }
      )), isLogin && /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          type: "button",
          className: "text-sm text-purple-400 hover:text-purple-300 transition-colors"
        },
        "Forgot password?"
      )), /* @__PURE__ */ React.createElement(
        Button,
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
        },
        loading ? /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), "Processing...") : /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, isLogin ? "Sign In" : "Create Account", /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-5 h-5" }))
      )),
      /* @__PURE__ */ React.createElement("div", { className: "mt-6 text-center text-sm text-gray-400" }, isLogin ? /* @__PURE__ */ React.createElement("p", null, "Don't have an account?", " ", /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setIsLogin(false),
          className: "text-purple-400 hover:text-purple-300 font-medium"
        },
        "Sign up now"
      )) : /* @__PURE__ */ React.createElement("p", null, "Already have an account?", " ", /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setIsLogin(true),
          className: "text-purple-400 hover:text-purple-300 font-medium"
        },
        "Sign in"
      )))
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        className: "mt-8 grid grid-cols-3 gap-4 text-center"
      },
      /* @__PURE__ */ React.createElement("div", { className: "backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-1" }, "\u{1F3A8}"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "AI Art")),
      /* @__PURE__ */ React.createElement("div", { className: "backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-1" }, "\u{1F5BC}\uFE0F"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Gallery")),
      /* @__PURE__ */ React.createElement("div", { className: "backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl mb-1" }, "\u{1F3AD}"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "3D View"))
    )
  ));
}
