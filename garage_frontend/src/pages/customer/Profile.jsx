import React, { useEffect, useState } from "react";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../../api/customer.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

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
        setFormData({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          email: data.user.email || "",
          phone: data.phone || "",
        });
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading profile information...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            No customer profile found. If you just registered as an Admin, you
            might not have a Customer profile linked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>My Profile</h1>

      <div className="mt-4 bg-white p-6 rounded shadow max-w-md">
        {!isEditing && (
          <>
            <div className="mb-4">
              <Input label="Username" value={profile.user.username} readOnly />
            </div>

            <div className="mb-4">
              <Input
                label="Name"
                value={`${profile.user.first_name} ${profile.user.last_name}`}
                readOnly
              />
            </div>

            <div className="mb-4">
              <Input label="Email" value={profile.user.email} readOnly />
            </div>

            <div className="mb-4">
              <Input
                label="Phone Number"
                value={profile.phone || "Not Set"}
                readOnly
              />
            </div>

            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="success">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;