import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MainLayout } from "./components/Layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AIConverter from "./pages/AIConverter";
import ImageEditor from "./pages/ImageEditor";
import ThreeDViewer from "./pages/ThreeDViewer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
const queryClient = new QueryClient();
function App() {
  return /* @__PURE__ */ React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ React.createElement(ThemeProvider, null, /* @__PURE__ */ React.createElement(AuthProvider, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/auth", element: /* @__PURE__ */ React.createElement(Auth, null) }), /* @__PURE__ */ React.createElement(Route, { path: "*", element: /* @__PURE__ */ React.createElement(MainLayout, null, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/", element: /* @__PURE__ */ React.createElement(Index, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/about", element: /* @__PURE__ */ React.createElement(About, null) }), /* @__PURE__ */ React.createElement(Route, { path: "/contact", element: /* @__PURE__ */ React.createElement(Contact, null) }), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/gallery",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Gallery, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/upload",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Upload, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/ai-converter",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(AIConverter, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/editor",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(ImageEditor, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/3d-viewer",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(ThreeDViewer, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/profile",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Profile, null))
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: "/settings",
      element: /* @__PURE__ */ React.createElement(ProtectedRoute, null, /* @__PURE__ */ React.createElement(Settings, null))
    }
  ), /* @__PURE__ */ React.createElement(Route, { path: "*", element: /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center h-[50vh] text-3xl font-bold text-gray-500" }, "404 - Page Not Found") }))) }))))));
}
export default App;
