import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Alert, MenuItem, Link } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import GavelIcon from '@mui/icons-material/Gavel';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'citizen'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '80%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Left side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  boxShadow: '0 30px 60px rgba(124,58,237,0.3)'
                }}
              >
                <GavelIcon sx={{ fontSize: 60, color: '#fff' }} />
              </Box>
            </motion.div>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Join Justice Platform
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.8
              }}
            >
              Create your account and experience modern legal case management.
            </Typography>

            <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Free Sign Up', 'Secure Data', '24/7 Access'].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>
                      {text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Right side - Register Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 4, md: 5 }, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxHeight: '90vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#fff',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
              Fill in your details to get started
            </Typography>
          
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'rgba(239,68,68,0.1)', 
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444',
                    '& .MuiAlert-icon': { color: '#ef4444' }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.03)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#fff' }
                  }}
                />
                
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.03)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#fff' }
                  }}
                />
              </Box>
            
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />
              
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />

              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />
              
              <TextField
                fullWidth
                select
                name="role"
                label="Select Your Role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff', borderWidth: 2 }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                  '& .MuiInputBase-input': { color: '#fff' },
                  '& .MuiSelect-select': { color: '#fff' }
                }}
              >
                <MenuItem value="citizen" sx={{ color: '#000' }}>Citizen</MenuItem>
                <MenuItem value="lawyer" sx={{ color: '#000' }}>Lawyer</MenuItem>
                <MenuItem value="judge" sx={{ color: '#000' }}>Judge</MenuItem>
              </TextField>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 3,
                    py: 1.8,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(124,58,237,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6c2dbd 0%, #00b8e6 100%)',
                      boxShadow: '0 15px 40px rgba(124,58,237,0.4)'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>
            </form>
            
            <Typography 
              variant="body2" 
              sx={{ mt: 3, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}
            >
              Already have an account?{' '}
              <Link 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#00d4ff', 
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
