import React, { useEffect, useState } from 'react';
import { getCustomerProfile, updateCustomerProfile } from '../../api/customer.api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ phone: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getCustomerProfile();
            console.log("Profile component received:", data);
            if (data) {
                setProfile(data);
                setFormData({ phone: data.phone || '' });
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCustomerProfile(profile.id, formData);
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully");
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (loading) return (
        <div className="p-4">
            <p>Loading profile information...</p>
        </div>
    );

    if (!profile) return (
        <div className="p-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">
                    No customer profile found. If you just registered as an Admin, you might not have a Customer profile linked.
                </p>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <h1>My Profile</h1>
            <div className="mt-4 bg-white p-6 rounded shadow max-w-md">
                <div className="mb-4">
                    <strong>Username:</strong> {profile.user.username}
                </div>
                <div className="mb-4">
                    <strong>Name:</strong> {profile.user.first_name} {profile.user.last_name}
                </div>
                <div className="mb-4">
                    <strong>Email:</strong> {profile.user.email}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="success">Save</Button>
                            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-4">
                        <strong>Phone:</strong> {profile.phone || 'Not Set'}
                        <div className="mt-4">
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
