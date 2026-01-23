import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../../api/customer.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import styles from "./Profile.module.css";

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
      toast.error("Failed to load profile data");
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
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile", error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (typeof errors === "object") {
          Object.keys(errors).forEach((key) => {
            toast.error(`${key}: ${errors[key]}`);
          });
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Loading profile information...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.noProfile}>
        <div className={styles.alert}>
          No customer profile found. If you just registered as an Admin, you
          might not have a Customer profile linked.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="primary">
            Edit Profile
          </Button>
        )}
      </div>

      <div className={styles.grid}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}></div>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {profile.user.first_name?.[0] || profile.user.username[0]}
              {profile.user.last_name?.[0] || ""}
            </div>
          </div>

          <div className={styles.profileInfo}>
            <h2 className={styles.name}>
              {profile.user.first_name || profile.user.username} {profile.user.last_name || ""}
            </h2>
            <p className={styles.username}>@{profile.user.username}</p>
            <div className={styles.badge}>{profile.user.role}</div>

            <div className={styles.memberSince}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Member Since</span>
                <span className={styles.value}>
                  {new Date(profile.date_joined).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Account Status</span>
                <span className={styles.value} style={{ textTransform: 'capitalize' }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.detailsCard}>
          {!isEditing ? (
            <div className={styles.section}>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>First Name</label>
                  <p className={styles.fieldValue}>{profile.user.first_name || "-"}</p>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Last Name</label>
                  <p className={styles.fieldValue}>{profile.user.last_name || "-"}</p>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <p className={styles.fieldValue}>{profile.user.email}</p>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone Number</label>
                <p className={styles.fieldValue}>{profile.phone || "Not Set"}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="e.g. John"
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="e.g. Doe"
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />

                <div className={styles.buttonGroup}>
                  <Button type="submit" variant="success">
                    Save Profile
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
