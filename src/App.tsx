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
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Auth Route - No Layout */}
                            <Route path="/auth" element={<Auth />} />

                            {/* All Other Routes - With Layout */}
                            <Route path="*" element={
                                <MainLayout>
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/" element={<Index />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/contact" element={<Contact />} />

                                        {/* Protected Routes */}
                                        <Route
                                            path="/gallery"
                                            element={
                                                <ProtectedRoute>
                                                    <Gallery />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/upload"
                                            element={
                                                <ProtectedRoute>
                                                    <Upload />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/ai-converter"
                                            element={
                                                <ProtectedRoute>
                                                    <AIConverter />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/editor"
                                            element={
                                                <ProtectedRoute>
                                                    <ImageEditor />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/3d-viewer"
                                            element={
                                                <ProtectedRoute>
                                                    <ThreeDViewer />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/profile"
                                            element={
                                                <ProtectedRoute>
                                                    <Profile />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/settings"
                                            element={
                                                <ProtectedRoute>
                                                    <Settings />
                                                </ProtectedRoute>
                                            }
                                        />

                                        <Route path="*" element={<div className="flex items-center justify-center h-[50vh] text-3xl font-bold text-gray-500">404 - Page Not Found</div>} />
                                    </Routes>
                                </MainLayout>
                            } />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
