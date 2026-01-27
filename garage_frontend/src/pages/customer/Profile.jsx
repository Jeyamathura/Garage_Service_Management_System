import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../../api/customer.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Check,
  X
} from "lucide-react";
import styles from "./Profile.module.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      }
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateCustomerProfile(profile.id, formData);
      setIsEditing(false);
      fetchProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.shimmer}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.noProfile}>
        <Card className={styles.alertCard}>
          <div className={styles.alertIcon}><User size={48} /></div>
          <h2>Account Missing Profile</h2>
          <p>It seems your account doesn't have a linked customer profile yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.hubContainer}>
      {/* Header Section */}
      <header className={styles.hubHeader}>
        <div className={styles.identity}>
          <div className={styles.initialsBox}>
            {profile.user.first_name?.[0] || profile.user.username[0]}
            {profile.user.last_name?.[0] || ""}
          </div>
          <div>
            <h1 className={styles.hubTitle}>
              {profile.user.first_name} {profile.user.last_name}
            </h1>
            <p className={styles.hubSubtitle}>{profile.user.role} Control Center</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} icon={Pencil} variant="primary">
            Edit Details
          </Button>
        )}
      </header>

      {/* Main Account Area */}
      <div className={styles.hubContent}>
        <Card className={styles.hubCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {isEditing ? "Modify Your Information" : "Account Information"}
            </h2>
            <p className={styles.cardSubtitle}>
              {isEditing ? "Ensure your contact details are up to date." : "Your verified personal and contact details."}
            </p>
          </div>

          {!isEditing ? (
            <div className={styles.infoHub}>
              <div className={styles.hubItem}>
                <div className={styles.hubLabel}>Full Identification</div>
                <div className={styles.hubValue}>
                  <User size={18} />
                  {profile.user.first_name} {profile.user.last_name}
                </div>
              </div>

              <div className={styles.hubItem}>
                <div className={styles.hubLabel}>Registered Email</div>
                <div className={styles.hubValue}>
                  <Mail size={18} />
                  {profile.user.email}
                </div>
              </div>

              <div className={styles.hubItem}>
                <div className={styles.hubLabel}>Active Contact</div>
                <div className={styles.hubValue}>
                  <Phone size={18} />
                  {profile.phone || "No contact number registered"}
                </div>
              </div>

              <div className={styles.hubItem}>
                <div className={styles.hubLabel}>Membership Since</div>
                <div className={styles.hubValue}>
                  <Calendar size={18} />
                  {new Date(profile.user.date_joined || Date.now()).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.hubForm}>
              <div className={styles.formGrid}>
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <Input
                label="Email Correspondence"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Primary Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="07XXXXXXXX"
                required
              />

              <div className={styles.hubActions}>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" loading={submitting}>Save Updates</Button>
              </div>
            </form>
          )}
        </Card>

        <section className={styles.securityHint}>
          <p>Need to update your password? Please contact system administration for security verification.</p>
        </section>
      </div>
    </div>
  );
};

export default Profile;
