import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { Booking } from '../types';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Printer } from 'lucide-react';

const BookingConfirmation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBooking();
        }
    }, [id]);

    const fetchBooking = async () => {
        try {
            const data = await publicApi.getBookingById(id!);
            setBooking(data);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find a booking with this reference number.
                    </p>
                    <Link
                        to="/booking"
                        className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700"
                    >
                        Make a New Booking
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                        <div className="flex items-center justify-center mb-4">
                            <CheckCircle className="h-16 w-16" />
                        </div>
                        <h1 className="text-3xl font-bold text-center">Booking Confirmed!</h1>
                        <p className="text-center mt-2 text-green-100">
                            Your appointment has been successfully booked
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 space-y-6">
                        {/* Confirmation Code */}
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
                            <p className="text-2xl font-bold text-gray-900">{booking.booking_ref}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Please save this reference for your records
                            </p>
                        </div>

                        {/* Service Details */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Service</p>
                                    <p className="font-medium text-gray-900">{booking.service?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Staff Member</p>
                                    <p className="font-medium text-gray-900">{booking.staff?.name}</p>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">Time</p>
                                            <p className="font-medium text-gray-900">
                                                {booking.start_time} - {booking.end_time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900">{booking.customer_name}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900">{booking.customer_email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-900">{booking.customer_phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-900 mb-2">Important Information</h3>
                            <ul className="text-sm text-yellow-800 space-y-1">
                                <li>• Please arrive 5 minutes before your appointment</li>
                                <li>• A confirmation email has been sent to your registered email address</li>
                                <li>• For cancellations, please contact us at least 24 hours in advance</li>
                                <li>• Contact us at (555) 123-4567 if you have any questions</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handlePrint}
                                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Printer className="h-5 w-5 mr-2" />
                                Print Confirmation
                            </button>
                            <Link
                                to="/booking"
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                            >
                                Make Another Booking
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>BeauBook Salon</p>
                    <p>123 Beauty Lane, Vancouver, BC</p>
                    <p>Phone: (555) 123-4567 | Email: info@beaubook.com</p>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;