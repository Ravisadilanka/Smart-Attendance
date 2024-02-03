import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase';

const PasswordReset = () => {
  const { search } = window.location;
  const oobCode = new URLSearchParams(search).get('oobCode');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if oobCode is present in the URL
    if (!oobCode) {
      // Handle the case when oobCode is missing
      navigate('/');
    }
  }, [oobCode, navigate]);

  const handleConfirmPasswordReset = async (e) => {
    e.preventDefault();
    try {
      // Confirm the password reset using oobCode
      await confirmPasswordReset(auth, oobCode, newPassword);
      navigate('/');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleConfirmPasswordReset}>
        <label>
          Enter your new password:
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordReset;
