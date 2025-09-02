import React, { useState, useEffect } from 'react';
import { Staff, StaffSchedule, StaffBreak } from '../types';
import { staffApi } from '../services/api';
import toast from 'react-hot-toast';
import { X, Clock, Calendar, Coffee, Save } from 'lucide-react';

interface StaffScheduleModalProps {
    staff: Staff;
    onClose: () => void;
    onUpdate: () => void;
}

interface DaySchedule {
    dayOfWeek: number;
    dayName: string;
    isActive: boolean;
    startTime: string;
    endTime: string;
}

interface BreakTime {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

const DAYS_OF_WEEK = [
    { value: 0, name: 'Sunday' },
    { value: 1, name: 'Monday' },
    { value: 2, name: 'Tuesday' },
    { value: 3, name: 'Wednesday' },
    { value: 4, name: 'Thursday' },
    { value: 5, name: 'Friday' },
    { value: 6, name: 'Saturday' },
];

const StaffScheduleModal: React.FC<StaffScheduleModalProps> = ({ staff, onClose, onUpdate }) => {
    const [schedules, setSchedules] = useState<DaySchedule[]>([]);
    const [breaks, setBreaks] = useState<BreakTime[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeSchedules();
    }, [staff]);

    const initializeSchedules = () => {
        // Initialize with default schedules for all days
        const defaultSchedules = DAYS_OF_WEEK.map(day => {
            const existingSchedule = staff.schedules?.find(s => s.day_of_week === day.value);
            return {
                dayOfWeek: day.value,
                dayName: day.name,
                isActive: existingSchedule?.is_active || false,
                startTime: existingSchedule?.start_time || '09:00',
                endTime: existingSchedule?.end_time || '18:00',
            };
        });
        setSchedules(defaultSchedules);

        // Initialize breaks
        if (staff.breaks) {
            const existingBreaks = staff.breaks.map(b => ({
                dayOfWeek: b.day_of_week,
                startTime: b.start_time,
                endTime: b.end_time,
            }));
            setBreaks(existingBreaks);
        }
    };

    const handleScheduleChange = (dayOfWeek: number, field: keyof DaySchedule, value: any) => {
        setSchedules(prev => prev.map(schedule =>
            schedule.dayOfWeek === dayOfWeek
                ? { ...schedule, [field]: value }
                : schedule
        ));
    };

    const handleAddBreak = (dayOfWeek: number) => {
        setBreaks(prev => [...prev, {
            dayOfWeek,
            startTime: '12:00',
            endTime: '13:00',
        }]);
    };

    const handleBreakChange = (index: number, field: keyof BreakTime, value: any) => {
        setBreaks(prev => prev.map((breakTime, i) =>
            i === index
                ? { ...breakTime, [field]: value }
                : breakTime
        ));
    };

    const handleRemoveBreak = (index: number) => {
        setBreaks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save schedules
            const scheduleData = schedules.map(schedule => ({
                day_of_week: schedule.dayOfWeek,
                start_time: schedule.startTime,
                end_time: schedule.endTime,
                is_active: schedule.isActive,
            }));

            await staffApi.updateSchedule(staff.id, scheduleData);

            // Save breaks
            const breakData = breaks.map(breakTime => ({
                day_of_week: breakTime.dayOfWeek,
                start_time: breakTime.startTime,
                end_time: breakTime.endTime,
            }));

            // Note: You may need to add a separate API call for breaks
            // await staffApi.updateBreaks(staff.id, breakData);

            toast.success('Schedule updated successfully');
            onUpdate();
            onClose();
        } catch (error) {
            toast.error('Failed to update schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToAll = (sourceDay: number) => {
        const sourceSchedule = schedules.find(s => s.dayOfWeek === sourceDay);
        if (sourceSchedule) {
            setSchedules(prev => prev.map(schedule => ({
                ...schedule,
                startTime: sourceSchedule.startTime,
                endTime: sourceSchedule.endTime,
                isActive: schedule.dayOfWeek === 0 ? false : sourceSchedule.isActive, // Keep Sunday off by default
            })));
            toast.success('Schedule copied to all days');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Manage Schedule - {staff.name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Set working hours and breaks for each day of the week
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Quick Actions */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span className="text-sm text-gray-600">Weekly Schedule</span>
                        </div>
                        <button
                            onClick={() => handleCopyToAll(1)} // Copy Monday's schedule
                            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                        >
                            Copy Monday to All Days
                        </button>
                    </div>

                    {/* Schedule Grid */}
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.dayOfWeek}
                                className={`border rounded-lg p-4 ${schedule.isActive ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            checked={schedule.isActive}
                                            onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'isActive', e.target.checked)}
                                            className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                        <span className={`font-medium ${schedule.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {schedule.dayName}
                                        </span>
                                    </div>

                                    {schedule.isActive && (
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <input
                                                    type="time"
                                                    value={schedule.startTime}
                                                    onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'startTime', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                />
                                                <span className="text-gray-500">to</span>
                                                <input
                                                    type="time"
                                                    value={schedule.endTime}
                                                    onChange={(e) => handleScheduleChange(schedule.dayOfWeek, 'endTime', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAddBreak(schedule.dayOfWeek)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                                            >
                                                <Coffee className="h-4 w-4 mr-1" />
                                                Add Break
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Breaks for this day */}
                                {schedule.isActive && (
                                    <div className="mt-3 space-y-2">
                                        {breaks
                                            .filter(b => b.dayOfWeek === schedule.dayOfWeek)
                                            .map((breakTime, index) => {
                                                const globalIndex = breaks.findIndex(b => b === breakTime);
                                                return (
                                                    <div key={index} className="flex items-center space-x-2 ml-9">
                                                        <Coffee className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">Break:</span>
                                                        <input
                                                            type="time"
                                                            value={breakTime.startTime}
                                                            onChange={(e) => handleBreakChange(globalIndex, 'startTime', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                                                        />
                                                        <span className="text-gray-500 text-sm">to</span>
                                                        <input
                                                            type="time"
                                                            value={breakTime.endTime}
                                                            onChange={(e) => handleBreakChange(globalIndex, 'endTime', e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveBreak(globalIndex)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Schedule Summary</h3>
                        <div className="text-sm text-blue-700">
                            <p>Working Days: {schedules.filter(s => s.isActive).length} days per week</p>
                            <p>Total Breaks: {breaks.length} breaks scheduled</p>
                            <p className="mt-2 text-xs">
                                Note: This schedule will be used to determine available booking slots for customers.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition flex items-center disabled:opacity-50"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffScheduleModal;