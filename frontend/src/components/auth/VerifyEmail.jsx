import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { authApi } = useApp();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verifyToken();
  }, [token, authApi, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          {status === 'verifying' && <Loader2 size={48} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />}
          {status === 'success' && <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto' }} />}
          {status === 'error' && <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto' }} />}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
          {status === 'verifying' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          {status === 'verifying' ? 'Please wait while we verify your email address. This should only take a moment.' : message}
        </p>

        {status !== 'verifying' && (
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};
