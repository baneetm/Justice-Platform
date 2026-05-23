import { useEffect, useState } from 'react';
import { Typography, Paper, Grid, Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await axios.get('/api/cases');
      setCases(res.data || []);
    } catch (err) {
      console.error('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'pending').length,
    assigned: cases.filter(c => c.status === 'assigned').length,
    closed: cases.filter(c => c.status === 'closed').length,
    revoked: cases.filter(c => c.status === 'revoked').length
  };

  const filteredCases = cases.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.case_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.case_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { title: 'Total Cases', value: stats.total, color: '#00d4ff', icon: '📁' },
    { title: 'Pending', value: stats.pending, color: '#ffc107', icon: '⏳' },
    { title: 'Assigned', value: stats.assigned, color: '#7c3aed', icon: '⚖️' },
    { title: 'Closed', value: stats.closed, color: '#10b981', icon: '✅' }
  ];

  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome back, {user?.first_name} {user?.last_name}
        </Typography>
        
        <Typography variant="h6" sx={{ color: '#888', mb: 4 }}>
          Here's your case overview
        </Typography>
      </motion.div>

      {/* Search Bar - Top Center */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search cases by title, number, type, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon sx={{ color: '#888', fontSize: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                color: '#fff',
                fontSize: '1rem'
              }
            }}
          />
        </Paper>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div variants={item}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 20px 40px ${stat.color}20`,
                      borderColor: stat.color
                    }
                  }}
                  onClick={() => navigate('/cases')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>{stat.icon}</Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '3rem', 
                        fontWeight: 700, 
                        color: stat.color,
                        lineHeight: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#888', fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Recent Cases List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Paper
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
            {searchQuery ? `Search Results (${filteredCases.length})` : 'Recent Cases'}
          </Typography>
          
          {filteredCases.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: '#888' }}>
              {searchQuery ? 'No cases match your search' : 'No cases found'}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredCases.slice(0, 5).map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Box
                    onClick={() => handleCaseClick(c.id)}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: '#00d4ff'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ color: '#00d4ff', fontWeight: 600, fontSize: '0.9rem' }}>
                          {c.case_number}
                        </Typography>
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                          {c.title}
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                          {c.case_type} • {c.lawyer_first_name ? `Assigned to: ${c.lawyer_first_name} ${c.lawyer_last_name || ''}` : 'Unassigned'} • Filed: {c.filed_date ? new Date(c.filed_date).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: c.status === 'pending' ? 'rgba(255, 193, 7, 0.2)' :
                                   c.status === 'assigned' ? 'rgba(0, 212, 255, 0.2)' :
                                   c.status === 'closed' ? 'rgba(16, 185, 129, 0.2)' :
                                   'rgba(239, 68, 68, 0.2)',
                          color: c.status === 'pending' ? '#ffc107' :
                                 c.status === 'assigned' ? '#00d4ff' :
                                 c.status === 'closed' ? '#10b981' :
                                 '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {c.status}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
              
              {filteredCases.length > 5 && (
                <Box 
                  onClick={() => navigate('/cases')}
                  sx={{ 
                    textAlign: 'center', 
                    py: 2, 
                    color: '#00d4ff', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  View all {filteredCases.length} cases →
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Paper
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ 
              px: 3, py: 1.5, borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff', fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { background: 'linear-gradient(90deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3))' }
            }}
            onClick={() => navigate('/cases')}
            >
              📁 View All Cases
            </Box>
            {user?.role === 'citizen' && (
              <Box sx={{ 
                px: 3, py: 1.5, borderRadius: 2,
                background: 'linear-gradient(90deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
                border: '1px solid rgba(0,212,255,0.3)',
                color: '#00d4ff', fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { background: 'linear-gradient(90deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3))' }
              }}>
                ➕ File New Case
              </Box>
            )}
            <Box sx={{ 
              px: 3, py: 1.5, borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff', fontSize: '0.875rem', fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { background: 'linear-gradient(90deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3))' }
            }}>
              👤 My Profile
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
