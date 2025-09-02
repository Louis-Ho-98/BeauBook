import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import { servicesApi, staffApi, bookingsApi } from '../services/api';
import { Service, Staff, TimeSlot } from '../types';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        bookingState,
        setSelectedService,
        setSelectedStaff,
        setSelectedDate,
        setSelectedTime,
        setCustomerInfo,
        resetBooking,
    } = useBooking();

    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (bookingState.selectedService) {
            fetchStaff();
        }
    }, [bookingState.selectedService]);

    useEffect(() => {
        if (bookingState.selectedStaff && bookingState.selectedDate) {
            fetchAvailableSlots();
        }
    }, [bookingState.selectedStaff, bookingState.selectedDate]);

    const fetchServices = async () => {
        try {
            const data = await servicesApi.getAll();
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        }
    };

    const fetchStaff = async () => {
        try {
            const data = await staffApi.getAll();
            setStaff(data);
        } catch (error) {
            toast.error('Failed to load staff');
        }
    };

    const fetchAvailableSlots = async () => {
        if (!bookingState.selectedService || !bookingState.selectedStaff || !bookingState.selectedDate) {
            return;
        }

        try {
            const data = await bookingsApi.getAvailableSlots({
                service_id: bookingState.selectedService.id,
                staff_id: bookingState.selectedStaff.id,
                date: bookingState.selectedDate,
            });
            setAvailableSlots(data);
        } catch (error) {
            toast.error('Failed to load available time slots');
        }
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setCurrentStep(2);
    };

    const handleStaffSelect = (staffMember: Staff) => {
        setSelectedStaff(staffMember);
        setCurrentStep(3);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setCurrentStep(4);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setCurrentStep(5);
    };

    const handleSubmitBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const customerInfo = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
        };

        setCustomerInfo(customerInfo);

        if (!bookingState.selectedService || !bookingState.selectedStaff ||
            !bookingState.selectedDate || !bookingState.selectedTime) {
            toast.error('Please complete all booking steps');
            return;
        }

        setLoading(true);
        try {
            const booking = await bookingsApi.create({
                service_id: bookingState.selectedService.id,
                staff_id: bookingState.selectedStaff.id,
                booking_date: bookingState.selectedDate,
                start_time: bookingState.selectedTime,
                customer_name: customerInfo.name,
                customer_email: customerInfo.email,
                customer_phone: customerInfo.phone,
            });

            toast.success('Booking confirmed!');
            navigate(`/booking/confirmation/${booking.id}`);
            resetBooking();
        } catch (error) {
            toast.error('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-8">Book Your Appointment</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`flex-1 ${step < 5 ? 'relative' : ''}`}
                            >
                                <div
                                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep >= step
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 5 && (
                                    <div
                                        className={`absolute top-5 left-1/2 w-full h-0.5 ${currentStep > step ? 'bg-pink-600' : 'bg-gray-300'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                        <span>Service</span>
                        <span>Staff</span>
                        <span>Date</span>
                        <span>Time</span>
                        <span>Details</span>
                    </div>
                </div>

                {/* Step 1: Select Service */}
                {currentStep >= 1 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service)}
                                    className={`p-4 border rounded-lg text-left hover:border-pink-500 transition ${bookingState.selectedService?.id === service.id
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <h3 className="font-semibold">{service.name}</h3>
                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-sm text-gray-500">
                                            {service.duration_minutes} min
                                        </span>
                                        <span className="font-semibold text-pink-600">
                                            ${service.price}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Staff */}
                {currentStep >= 2 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select Staff Member</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {staff.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => handleStaffSelect(member)}
                                    className={`p-4 border rounded-lg text-left hover:border-pink-500 transition ${bookingState.selectedStaff?.id === member.id
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                            <User className="w-6 h-6 text-pink-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{member.name}</h3>
                                            {member.specialties && (
                                                <p className="text-sm text-gray-600">
                                                    {member.specialties.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Select Date */}
                {currentStep >= 3 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select Date</h2>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                            <input
                                type="date"
                                min={today}
                                max={maxDateString}
                                value={bookingState.selectedDate || ''}
                                onChange={(e) => handleDateSelect(e.target.value)}
                                className="form-input rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Select Time */}
                {currentStep >= 4 && bookingState.selectedDate && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select Time</h2>
                        {availableSlots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Clock className="w-8 h-8 text-gray-400 mb-3" />
                                <p className="text-gray-600 text-base font-medium text-center">
                                    Sorry, there are no available time slots for this service on your selected date.<br />
                                    Please choose another date or try a different staff member.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() => handleTimeSelect(slot.time)}
                                        disabled={!slot.available}
                                        className={`p-3 border rounded-lg transition ${bookingState.selectedTime === slot.time
                                            ? 'border-pink-500 bg-pink-50'
                                            : slot.available
                                                ? 'border-gray-200 hover:border-pink-500'
                                                : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 5: Customer Information */}
                {currentStep >= 5 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                        <form onSubmit={handleSubmitBooking}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Booking Summary</h3>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className="text-gray-600">Service:</span>{' '}
                                        {bookingState.selectedService?.name}
                                    </p>
                                    <p>
                                        <span className="text-gray-600">Staff:</span>{' '}
                                        {bookingState.selectedStaff?.name}
                                    </p>
                                    <p>
                                        <span className="text-gray-600">Date:</span>{' '}
                                        {bookingState.selectedDate}
                                    </p>
                                    <p>
                                        <span className="text-gray-600">Time:</span>{' '}
                                        {bookingState.selectedTime}
                                    </p>
                                    <p className="font-semibold text-pink-600">
                                        Total: ${bookingState.selectedService?.price}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;