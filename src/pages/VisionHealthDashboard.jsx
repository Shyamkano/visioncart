import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Make sure this path is correct
import { useAuth } from './AuthContext'; // Make sure this path is correct
import './VisionHealthDashboard.css';
import { Eye, Calendar, HeartPulse, Clock, Carrot, Glasses, CalendarCheck } from 'lucide-react';
import PrescriptionForm from './PrescriptionForm'; // Assuming you have this component for the form

// --- Reusable Components (can be moved to their own file later) ---

const UserInfoCard = ({ icon: Icon, title, children }) => (
  <div className="user-info-card">
    <h3>
      <Icon className="card-icon" /> {title}
    </h3>
    {children}
  </div>
);

const HealthTipCard = ({ icon: Icon, title, description }) => (
  <div className="vision-health-card">
    <h3>
      <Icon className="card-icon" /> {title}
    </h3>
    <p>{description}</p>
  </div>
);

// --- Main Dashboard Component ---

const VisionHealthDashboard = () => {
  const { user, profile } = useAuth(); // Get both user and profile from the context
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  // Function to fetch or re-fetch prescription data
  const fetchPrescription = async () => {
    if (!user) return;

    // Use the corrected table name 'prescriptions'
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', user.id)
      .single(); // .single() is good, it returns one object or an error

    // PGRST116 is the error code for "No rows found", which is not a real error in this case.
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching prescription:", error);
    } else {
      setPrescription(data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPrescription().finally(() => setLoading(false));
  }, [user]);

  const handlePrescriptionUpdated = () => {
    setShowPrescriptionForm(false);
    fetchPrescription(); // Re-fetch the data after an update
  };

  const healthTips = [
    { icon: Clock, title: 'Follow the 20-20-20 Rule', description: 'Every 20 minutes, take a 20-second break and look at something 20 feet away.' },
    { icon: Carrot, title: 'Eat a Balanced Diet', description: 'Include foods rich in vitamins C, E, zinc, lutein, and omega-3 fatty acids.' },
    { icon: Glasses, title: 'Wear Sunglasses', description: 'Protect your eyes from harmful UV rays with 99%+ UVA/UVB protection.' },
    { icon: CalendarCheck, title: 'Get Regular Eye Exams', description: 'Schedule a comprehensive eye exam every 1–2 years to detect issues early.' },
  ];

  if (loading) {
    return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff' }}>Loading your vision health data...</div>;
  }

  return (
    <div className="vision-health-container">
      {/* Header */}
      <div className="vision-health-header">
        <h1>Vision Health Dashboard</h1>
        <p>
          {/* Use the full_name from the profile for a personalized greeting */}
          Welcome, {profile?.full_name || user?.email}! Here is your personalized space for maintaining and improving your eye health.
        </p>
      </div>

      {/* User Info Grid */}
      <div className="user-info-grid">
        <UserInfoCard icon={Eye} title="Your Prescription">
          {prescription ? (
            <div className="eyesight-info">
              <div className="eye-info">
                <p className="eye-label">Left (OD)</p>
                {/* Use optional chaining (?.) for safety in case 'data' or 'left_eye' doesn't exist */}
                <p className="eye-value">{prescription.data?.left_eye || 'N/A'}</p>
              </div>
              <div className="eye-info">
                <p className="eye-label">Right (OS)</p>
                <p className="eye-value">{prescription.data?.right_eye || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p>You haven't added your prescription data yet.</p>
          )}
          
          <button onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}>
            {showPrescriptionForm ? 'Cancel Update' : (prescription ? 'Update Prescription' : 'Add Prescription')}
          </button>

          {/* Conditionally render the form */}
          {showPrescriptionForm && <PrescriptionForm onPrescriptionUpdated={handlePrescriptionUpdated} />}
        </UserInfoCard>

        <UserInfoCard icon={Calendar} title="Last Checkup">
          <p className="checkup-date">
            {prescription?.data?.last_checkup
              ? new Date(prescription.data.last_checkup).toLocaleDateString()
              : 'N/A'}
          </p>
        </UserInfoCard>

        <UserInfoCard icon={HeartPulse} title="Eye Health Score">
          <div className="health-score-card">
            <div className="health-score-circle">
              <span>{prescription?.data?.health_score || 'N/A'}</span>
              <small>/100</small>
            </div>
            <p className="score-hint">Keep up the great work to improve your score!</p>
          </div>
        </UserInfoCard>
      </div>

      {/* Health Tips Grid */}
      <div className="vision-health-grid">
        {healthTips.map((tip, index) => (
          <HealthTipCard key={index} {...tip} />
        ))}
      </div>
    </div>
  );
};

export default VisionHealthDashboard;