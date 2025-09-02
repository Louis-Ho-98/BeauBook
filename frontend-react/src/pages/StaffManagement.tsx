import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../services/api';
import { Staff } from '../types';
import toast from 'react-hot-toast';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Mail,
    Phone,
    Star,
    Search,
    ChevronLeft,
    Clock,
    UserCheck,
    UserX
} from 'lucide-react';
import StaffFormModal from '../components/StaffFormModal';
import StaffScheduleModal from '../components/StaffScheduleModal';

const StaffManagement: React.FC = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await staffApi.getAll();
            setStaff(data);
        } catch (error) {
            toast.error('Failed to load staff members');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = () => {
        setEditingStaff(null);
        setShowFormModal(true);
    };

    const handleEditStaff = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setShowFormModal(true);
    };

    const handleDeleteStaff = async (staffId: string) => {
        if (!confirm('Are you sure you want to deactivate this staff member?')) {
            return;
        }

        try {
            await staffApi.delete(staffId);
            toast.success('Staff member deactivated successfully');
            fetchStaff();
        } catch (error) {
            toast.error('Failed to deactivate staff member');
        }
    };

    const handleManageSchedule = (staffMember: Staff) => {
        setSelectedStaff(staffMember);
        setShowScheduleModal(true);
    };

    const handleSaveStaff = async (staffData: Partial<Staff>) => {
        try {
            if (editingStaff) {
                await staffApi.update(editingStaff.id, staffData);
                toast.success('Staff member updated successfully');
            } else {
                await staffApi.create(staffData);
                toast.success('Staff member added successfully');
            }
            setShowFormModal(false);
            fetchStaff();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to save staff member');
        }
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                            <p className="text-gray-600 mt-2">Manage your team members and their schedules</p>
                        </div>
                        <button
                            onClick={handleAddStaff}
                            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Staff Member
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search staff by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <UserCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {staff.filter(s => s.is_active).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                                <p className="text-2xl font-semibold text-gray-900">{staff.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Schedules Set</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {staff.filter(s => s.schedules && s.schedules.length > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg">
                            <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No staff members found</p>
                        </div>
                    ) : (
                        filteredStaff.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    {/* Staff Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                                <Users className="h-6 w-6 text-pink-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${member.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {member.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 mb-4">
                                        {member.email && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                {member.email}
                                            </div>
                                        )}
                                        {member.phone && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {member.phone}
                                            </div>
                                        )}
                                    </div>

                                    {/* Specialties */}
                                    {member.specialties && member.specialties.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                                Specialties
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {member.specialties.map((specialty, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-4 border-t">
                                        <button
                                            onClick={() => handleManageSchedule(member)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                                        >
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Schedule
                                        </button>
                                        <button
                                            onClick={() => handleEditStaff(member)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStaff(member.id)}
                                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modals */}
                {showFormModal && (
                    <StaffFormModal
                        staff={editingStaff}
                        onSave={handleSaveStaff}
                        onClose={() => setShowFormModal(false)}
                    />
                )}

                {showScheduleModal && selectedStaff && (
                    <StaffScheduleModal
                        staff={selectedStaff}
                        onClose={() => {
                            setShowScheduleModal(false);
                            setSelectedStaff(null);
                        }}
                        onUpdate={fetchStaff}
                    />
                )}
            </div>
        </div>
    );
};

export default StaffManagement;