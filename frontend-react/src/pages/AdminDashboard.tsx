import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../services/api';
import { Booking, Staff, Service } from '../types';
import toast from 'react-hot-toast';
import {
    Calendar,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { admin } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState({
        todayBookings: 0,
        todayRevenue: 0,
        monthlyBookings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedDate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch bookings
            const bookingsData = await adminApi.getBookings({
                date: selectedDate,
                limit: 20
            });
            setBookings(bookingsData.bookings);

            // Fetch stats
            const statsData = await adminApi.getBookingStats();
            setStats(statsData);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed' | 'no-show') => {
        try {
            await adminApi.updateBookingStatus(bookingId, status);
            toast.success(`Booking ${status}`);
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to update booking status');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            confirmed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
            'no-show': 'bg-gray-100 text-gray-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {admin?.name || admin?.email}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-pink-100 rounded-lg p-3">
                                <Calendar className="h-6 w-6 text-pink-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.todayBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">${stats.todayRevenue}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Bookings</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.monthlyBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                                <p className="text-2xl font-semibold text-gray-900">5</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Staff
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No bookings found for this date
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{booking.start_time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.customer_name}</div>
                                            <div className="text-sm text-gray-500">{booking.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.service?.name}</div>
                                            <div className="text-sm text-gray-500">${booking.service?.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.staff?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Mark as completed"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateBookingStatus(booking.id, 'no-show')}
                                                            className="text-orange-600 hover:text-orange-900"
                                                            title="Mark as no-show"
                                                        >
                                                            <AlertCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <button
                                                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Cancel booking"
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-white border-2 border-pink-600 text-pink-600 py-3 px-6 rounded-lg font-semibold hover:bg-pink-50 transition">
                        Manage Services
                    </button>
                    <button className="bg-white border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition">
                        Manage Staff
                    </button>
                    <button className="bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition">
                        Business Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;