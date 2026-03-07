import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import './AppointmentPage.css';
import { Link } from 'react-router-dom';
import { Stethoscope, Star, Briefcase, Video, Phone, User } from 'lucide-react';

// --- Reusable Sub-Components ---

const DoctorCard = ({ doc, isSelected, onSelect }) => (
  <div
    className={`doctor-card ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(doc)}
  >
    <img src={doc.photo} alt={doc.name} />
    <h3>{doc.name}</h3>
    <p>{doc.specialization}</p>
    <div className="doctor-info">
      <span>
        <Briefcase size={16} /> {doc.experience}
      </span>
      <span>
        <Star size={16} /> {doc.rating}
      </span>
    </div>
  </div>
);

const TimeSlot = ({ slot, isSelected, onSelect }) => (
  <button
    className={`time-slot ${isSelected ? 'selected' : ''}`}
    onClick={() => onSelect(slot)}
  >
    {slot}
  </button>
);

// --- Main Page Component ---

const AppointmentPage = () => {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationMode, setConsultationMode] = useState('In-person');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const doctors = [
    { id: 1, name: 'Dr. Anita Mehra', specialization: 'Optometrist', experience: '10 years', rating: 4.8, photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Dr. Rajesh Shah', specialization: 'Ophthalmologist', experience: '15 years', rating: 4.6, photo: 'https://randomuser.me/api/portraits/men/46.jpg' },
  ];

  const timeSlots = ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  const isBookingReady = selectedDoctor && selectedDate && selectedTime;

  const handleConfirm = async () => {
    if (!isBookingReady || !user) return;

    setIsLoading(true);
    const { error } = await supabase.from('appointments').insert([
      {
        user_id: user.id,
        doctor_name: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        type: consultationMode,
        status: 'Confirmed',
      },
    ]);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      setIsConfirmed(true);
    }
    setIsLoading(false);
  };

  if (isConfirmed) {
    return (
      <div className="appointment-container" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <h2>Appointment Confirmed!</h2>
        <p>Your appointment has been successfully booked. You can view the details on your profile page.</p>
        <Link to="/profile" className="primary-btn">View Profile</Link>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <div className="appointment-content">
        <div className="appointment-header">
          <h1>Book an Eye Exam</h1>
          <p>Schedule your next appointment with our top specialists.</p>
        </div>

        {/* Step 1: Doctor Selection */}
        <div className="appointment-step">
          <h2>1. Select a Doctor</h2>
          <div className="doctor-grid">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doc={doc}
                isSelected={selectedDoctor?.id === doc.id}
                onSelect={setSelectedDoctor}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Date & Time */}
        <div className="appointment-step">
          <h2>2. Select Date & Time</h2>
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevents selecting past dates
          />
          <div className="time-slot-grid" style={{ marginTop: '20px' }}>
            {timeSlots.map((slot) => (
              <TimeSlot
                key={slot}
                slot={slot}
                isSelected={selectedTime === slot}
                onSelect={setSelectedTime}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Consultation Mode */}
        <div className="appointment-step">
          <h2>3. Choose Consultation Mode</h2>
          <div className="mode-toggle">
            {[
              { name: 'In-person', icon: <User size={18} /> },
              { name: 'Video Call', icon: <Video size={18} /> },
              { name: 'Phone', icon: <Phone size={18} /> },
            ].map((mode) => (
              <button
                key={mode.name}
                className={consultationMode === mode.name ? 'active' : ''}
                onClick={() => setConsultationMode(mode.name)}
              >
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Confirmation */}
        <div className="summary-card">
          <h3>Appointment Summary</h3>
          <div className="summary-item">
            <span className="summary-label">Doctor</span>
            <span className="summary-value">{selectedDoctor?.name || 'Not selected'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Date</span>
            <span className="summary-value">{selectedDate || 'Not selected'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Time</span>
            <span className="summary-value">{selectedTime || 'Not selected'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Mode</span>
            <span className="summary-value">{consultationMode}</span>
          </div>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={!isBookingReady || isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
