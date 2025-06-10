'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { IUserSession, UpdateUserProps } from '@/app/types/index';
import { IUserFormData } from '@/app/types/index';
import { toast } from 'react-toastify';

interface Props extends UpdateUserProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdateUser({ user, onUpdateSuccess, isOpen, onClose }: Props) {
    const { userData, setUserData } = useAuth();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<IUserFormData>({
        name: '',
        email: '',
        phone: '',
        country: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || '',
                address: user.address || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = userData?.token;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onClose();
                if (userData) {
                    const updatedUser = {
                        ...userData,
                        user: {
                            ...userData.user,
                            ...formData
                        }
                    }
                    setUserData(updatedUser);
                }
                toast.success('User updated successfully!');

                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Error updating user. Please try again.');
        }
    };

    return (
        <>
            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-75 z-40" />
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            ref={modalRef}
                            className="bg-white rounded-lg shadow-xl w-[500px] p-6 relative"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Edit User Information
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 "
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 