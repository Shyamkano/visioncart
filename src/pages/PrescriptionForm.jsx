import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const PrescriptionForm = ({ onPrescriptionUpdated }) => {
  const { user } = useAuth();
  const [leftEye, setLeftEye] = useState('');
  const [rightEye, setRightEye] = useState('');
  const [lastCheckup, setLastCheckup] = useState('');
  const [healthScore, setHealthScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('prescription')
        .select('data')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setLeftEye(data.data.left_eye || '');
        setRightEye(data.data.right_eye || '');
        setLastCheckup(data.data.last_checkup || '');
        setHealthScore(data.data.health_score || '');
      }
    };

    fetchPrescription();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const prescriptionData = {
      left_eye: leftEye,
      right_eye: rightEye,
      last_checkup: lastCheckup,
      health_score: parseInt(healthScore, 10),
    };

    const { data, error } = await supabase
      .from('prescription')
      .upsert({ user_id: user.id, data: prescriptionData }, { onConflict: 'user_id' });

    if (error) {
      console.error("Error updating prescription:", error);
      alert(`Error: ${error.message}`);
    } else {
      alert('Prescription updated successfully!');
      onPrescriptionUpdated();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="prescription-form">
      <input type="text" placeholder="Left Eye" value={leftEye} onChange={(e) => setLeftEye(e.target.value)} />
      <input type="text" placeholder="Right Eye" value={rightEye} onChange={(e) => setRightEye(e.target.value)} />
      <input type="date" placeholder="Last Checkup" value={lastCheckup} onChange={(e) => setLastCheckup(e.target.value)} />
      <input type="number" placeholder="Health Score" value={healthScore} onChange={(e) => setHealthScore(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Prescription'}
      </button>
    </form>
  );
};

export default PrescriptionForm;
