import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native-web';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onSuccess, 
  onBackToLogin 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Set success state
      setSuccess(true);
      
      // Call onSuccess callback
      onSuccess();
    } catch (err: any) {
      console.error('Error sending password reset email:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else {
        setError('Failed to send reset email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      
      {success ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Password reset email sent! Check your inbox for further instructions.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onBackToLogin}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backLink} onPress={onBackToLogin}>
            <Text style={styles.backLinkText}>← Back to Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#065f46',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backLinkText: {
    color: '#4f46e5',
    fontSize: 16,
  },
});

export default ForgotPasswordForm;
