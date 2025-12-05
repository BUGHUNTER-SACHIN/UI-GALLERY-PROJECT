import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center min-h-screen" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }));
  }
  if (!user) {
    return /* @__PURE__ */ React.createElement(Navigate, { to: "/auth" });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};
