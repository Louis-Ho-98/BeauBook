import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Star } from 'lucide-react';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to BeauBook Salon
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-pink-100">
                            Your beauty, our passion. Book your appointment today!
                        </p>
                        <Link
                            to="/booking"
                            className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition duration-300 shadow-lg"
                        >
                            Book Appointment Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Why Choose BeauBook?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                            <p className="text-gray-600">
                                Book your appointment in just a few clicks, anytime, anywhere.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Staff</h3>
                            <p className="text-gray-600">
                                Our skilled professionals are dedicated to making you look and feel your best.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Flexible Hours</h3>
                            <p className="text-gray-600">
                                We're open when you need us, with convenient hours to fit your schedule.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Top Quality</h3>
                            <p className="text-gray-600">
                                We use premium products and the latest techniques for outstanding results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Our Popular Services
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                            <div className="h-48 bg-gradient-to-r from-pink-400 to-pink-500"></div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Hair Services</h3>
                                <p className="text-gray-600 mb-4">
                                    Cuts, colors, treatments, and styling for all hair types.
                                </p>
                                <Link
                                    to="/booking"
                                    className="text-pink-600 font-semibold hover:text-pink-700"
                                >
                                    Book Now →
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                            <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-500"></div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Nail Services</h3>
                                <p className="text-gray-600 mb-4">
                                    Manicures, pedicures, gel nails, and nail art designs.
                                </p>
                                <Link
                                    to="/booking"
                                    className="text-pink-600 font-semibold hover:text-pink-700"
                                >
                                    Book Now →
                                </Link>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500"></div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Spa Treatments</h3>
                                <p className="text-gray-600 mb-4">
                                    Facials, massages, and relaxing wellness treatments.
                                </p>
                                <Link
                                    to="/booking"
                                    className="text-pink-600 font-semibold hover:text-pink-700"
                                >
                                    Book Now →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Look and Feel Your Best?
                    </h2>
                    <p className="text-xl mb-8 text-gray-300">
                        Join thousands of satisfied customers who trust BeauBook for their beauty needs.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/booking"
                            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition duration-300"
                        >
                            Book Appointment
                        </Link>
                        <a
                            href="tel:555-123-4567"
                            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition duration-300"
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;