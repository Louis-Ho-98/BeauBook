import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service, Staff, BookingState } from '@/types';

interface BookingContextType {
    bookingState: BookingState;
    setSelectedService: (service: Service | null) => void;
    setSelectedStaff: (staff: Staff | null) => void;
    setSelectedDate: (date: string | null) => void;
    setSelectedTime: (time: string | null) => void;
    setCustomerInfo: (info: BookingState['customerInfo']) => void;
    resetBooking: () => void;
}

const initialBookingState: BookingState = {
    selectedService: null,
    selectedStaff: null,
    selectedDate: null,
    selectedTime: null,
    customerInfo: {
        name: '',
        email: '',
        phone: '',
        notes: '',
    },
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};

interface BookingProviderProps {
    children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
    const [bookingState, setBookingState] = useState<BookingState>(initialBookingState);

    const setSelectedService = (service: Service | null) => {
        setBookingState((prev) => ({ ...prev, selectedService: service }));
    };

    const setSelectedStaff = (staff: Staff | null) => {
        setBookingState((prev) => ({ ...prev, selectedStaff: staff }));
    };

    const setSelectedDate = (date: string | null) => {
        setBookingState((prev) => ({ ...prev, selectedDate: date }));
    };

    const setSelectedTime = (time: string | null) => {
        setBookingState((prev) => ({ ...prev, selectedTime: time }));
    };

    const setCustomerInfo = (info: BookingState['customerInfo']) => {
        setBookingState((prev) => ({ ...prev, customerInfo: info }));
    };

    const resetBooking = () => {
        setBookingState(initialBookingState);
    };

    const value: BookingContextType = {
        bookingState,
        setSelectedService,
        setSelectedStaff,
        setSelectedDate,
        setSelectedTime,
        setCustomerInfo,
        resetBooking,
    };

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export default BookingContext;