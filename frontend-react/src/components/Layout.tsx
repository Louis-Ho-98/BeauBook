import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { admin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold text-pink-600">BeauBook</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center space-x-4">
                            {!isAdminRoute && (
                                <>
                                    <Link
                                        to="/"
                                        className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/booking"
                                        className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Book Now
                                    </Link>
                                </>
                            )}

                            {admin ? (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <span className="text-gray-600 text-sm">
                                        {admin.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/admin/login"
                                    className="bg-pink-600 text-white hover:bg-pink-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Staff Login
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">BeauBook Salon</h3>
                            <p className="text-gray-300 text-sm">
                                Your trusted beauty partner. Book appointments easily and manage your salon efficiently.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/" className="text-gray-300 hover:text-white">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/booking" className="text-gray-300 hover:text-white">
                                        Book Appointment
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/login" className="text-gray-300 hover:text-white">
                                        Staff Portal
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>📍 123 Beauty Lane, Vancouver, BC</li>
                                <li>📞 (555) 123-4567</li>
                                <li>✉️ info@beaubook.com</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                        <p>&copy; 2024 BeauBook. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;