import React, { useState, useEffect } from 'react';
import { Staff } from '../types';
import { X, User, Mail, Phone, FileText, Star } from 'lucide-react';

interface StaffFormModalProps {
    staff: Staff | null;
    onSave: (staffData: Partial<Staff>) => void;
    onClose: () => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ staff, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<Staff>>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        specialties: [],
        is_active: true,
    });
    const [specialtyInput, setSpecialtyInput] = useState('');

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name,
                email: staff.email || '',
                phone: staff.phone || '',
                bio: staff.bio || '',
                specialties: staff.specialties || [],
                is_active: staff.is_active !== undefined ? staff.is_active : true,
            });
        }
    }, [staff]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAddSpecialty = () => {
        if (specialtyInput.trim() && !formData.specialties?.includes(specialtyInput.trim())) {
            setFormData(prev => ({
                ...prev,
                specialties: [...(prev.specialties || []), specialtyInput.trim()],
            }));
            setSpecialtyInput('');
        }
    };

    const handleRemoveSpecialty = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties?.filter(s => s !== specialty) || [],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim()) {
            alert('Please enter a name');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <User className="h-4 w-4 mr-2" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter staff member's full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="staff@example.com"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Bio / Description
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Brief description about the staff member..."
                        />
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Star className="h-4 w-4 mr-2" />
                            Specialties
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={specialtyInput}
                                onChange={(e) => setSpecialtyInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSpecialty();
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                placeholder="Enter a specialty (e.g., Hair Color, Manicure)"
                            />
                            <button
                                type="button"
                                onClick={handleAddSpecialty}
                                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.specialties?.map((specialty, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                >
                                    {specialty}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSpecialty(specialty)}
                                        className="ml-2 hover:text-purple-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                            Staff member is active
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                        >
                            {staff ? 'Update Staff' : 'Add Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffFormModal;