import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BookingConfirmation from './pages/BookingConfirmation';
import StaffManagement from './pages/StaffManagement';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <BookingProvider>
                    <Layout>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/booking" element={<BookingPage />} />
                            <Route path="/booking/confirmation/:ref" element={<BookingConfirmation />} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/staff"
                                element={
                                    <ProtectedRoute>
                                        <StaffManagement />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Layout>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#333',
                                color: '#fff',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </BookingProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;