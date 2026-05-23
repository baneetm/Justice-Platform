import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Skeleton
} from '@mui/material';
import { Visibility, Add, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Cases() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    caseType: 'civil'
  });

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

  const handleCreate = async () => {
    try {
      await axios.post('/api/cases', newCase);
      setOpen(false);
      fetchCases();
      setNewCase({ title: '', description: '', caseType: 'civil' });
    } catch (err) {
      alert('Failed to create case');
    }
  };

  const handleAssignCase = async (caseId) => {
    try {
      await axios.post(`/api/cases/${caseId}/assign`);
      fetchCases();
    } catch (err) {
      alert('Failed to assign case');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      assigned: 'info',
      in_progress: 'primary',
      closed: 'success',
      revoked: 'error',
      appealed: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Cases
          </Typography>
          
          {user?.role === 'citizen' && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{
                  background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00b8e6, #6c2dbd)'
                  }
                }}
              >
                File New Case
              </Button>
            </motion.div>
          )}
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TableContainer 
          component={Paper}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(0,0,0,0.2)' }}>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Case Number</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Filed Date</TableCell>
                <TableCell sx={{ color: '#888', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#888', py: 4 }}>
                    No cases found
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((c) => (
                  <TableRow 
                    key={c.id}
                    sx={{ 
                      '&:hover': { background: 'rgba(255,255,255,0.05)' },
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <TableCell sx={{ color: '#fff' }}>{c.case_number}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{c.title}</TableCell>
                    <TableCell sx={{ color: '#888' }}>{c.case_type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={c.status} 
                        color={getStatusColor(c.status)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#888' }}>
                      {c.filed_date ? new Date(c.filed_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <IconButton 
                            onClick={() => navigate(`/cases/${c.id}`)}
                            sx={{ color: '#00d4ff' }}
                          >
                            <Visibility />
                          </IconButton>
                        </motion.div>

                        {user?.role === 'lawyer' && c.status === 'pending' && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton 
                              onClick={() => handleAssignCase(c.id)}
                              sx={{ color: '#10b981' }}
                              title="Accept Case"
                            >
                              <CheckCircle />
                            </IconButton>
                          </motion.div>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* Create Case Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600 }}>
          File New Case
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newCase.title}
            onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
            margin="normal"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputBase-input': { color: '#fff' }
            }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={newCase.description}
            onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
            margin="normal"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputBase-input': { color: '#fff' }
            }}
          />
          <TextField
            fullWidth
            select
            label="Case Type"
            value={newCase.caseType}
            onChange={(e) => setNewCase({ ...newCase, caseType: e.target.value })}
            margin="normal"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
              },
              '& .MuiInputLabel-root': { color: '#888' },
              '& .MuiInputBase-input': { color: '#fff' },
              '& .MuiSelect-select': { color: '#fff' }
            }}
          >
            <MenuItem value="civil" sx={{ color: '#000' }}>Civil</MenuItem>
            <MenuItem value="criminal" sx={{ color: '#000' }}>Criminal</MenuItem>
            <MenuItem value="family" sx={{ color: '#000' }}>Family</MenuItem>
            <MenuItem value="property" sx={{ color: '#000' }}>Property</MenuItem>
            <MenuItem value="other" sx={{ color: '#000' }}>Other</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleCreate} 
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #00b8e6, #6c2dbd)'
                }
              }}
            >
              Submit
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
