import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Paper, Grid, Box, Chip, Button, TextField,
  List, ListItem, ListItemText, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem
} from '@mui/material';
import { ArrowBack, Gavel, Cancel, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [judgment, setJudgment] = useState('');

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const res = await axios.get(`/api/cases/${id}`);
      setCaseData(res.data);
      setNewStatus(res.data.status);
      setRemarks(res.data.legal_remarks || '');
      setJudgment(res.data.judgment || '');
    } catch (err) {
      console.error('Failed to fetch case');
    }
  };

  const handleAssign = async () => {
    try {
      await axios.post(`/api/cases/${id}/assign`);
      fetchCase();
    } catch (err) {
      alert('Failed to assign case');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.patch(`/api/cases/${id}/status`, {
        status: newStatus,
        legalRemarks: remarks,
        judgment: judgment
      });
      setStatusDialog(false);
      fetchCase();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!caseData) return <div>Loading...</div>;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      assigned: 'info',
      in_progress: 'primary',
      closed: 'success',
      revoked: 'error'
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/cases')}
          sx={{ mb: 2, color: '#888' }}
        >
          Back to Cases
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Main Case Info */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                  {caseData.case_number}
                </Typography>
                <Chip 
                  label={caseData.status.toUpperCase()} 
                  color={getStatusColor(caseData.status)}
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                {caseData.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#aaa' }}>
                {caseData.description}
              </Typography>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Legal Remarks from Lawyer */}
              {caseData.legal_remarks && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#00d4ff', mb: 1 }}>
                    ⚖️ Lawyer's Legal Remarks
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(0,212,255,0.1)', borderRadius: 2 }}>
                    <Typography sx={{ color: '#fff' }}>
                      {caseData.legal_remarks}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Judgment from Judge */}
              {caseData.judgment && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 1 }}>
                    🏛️ Judgment
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(16,185,129,0.1)', borderRadius: 2 }}>
                    <Typography sx={{ color: '#fff' }}>
                      {caseData.judgment}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {/* Lawyer: Take Case */}
                {user?.role === 'lawyer' && !caseData.lawyer_id && caseData.status === 'pending' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="contained"
                      onClick={handleAssign}
                      sx={{
                        background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                        '&:hover': { background: 'linear-gradient(90deg, #00b8e6, #6c2dbd)' }
                      }}
                    >
                      <CheckCircle sx={{ mr: 1 }} /> Take This Case
                    </Button>
                  </motion.div>
                )}

                {/* Lawyer: Add Remarks */}
                {user?.role === 'lawyer' && caseData.lawyer_id === user?.id && caseData.status !== 'closed' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outlined"
                      onClick={() => setStatusDialog(true)}
                      sx={{
                        borderColor: '#00d4ff',
                        color: '#00d4ff',
                        '&:hover': { borderColor: '#00b8e6', bgcolor: 'rgba(0,212,255,0.1)' }
                      }}
                    >
                      <Gavel sx={{ mr: 1 }} /> Add Legal Remarks
                    </Button>
                  </motion.div>
                )}

                {/* Judge: Close/Revoke Case */}
                {user?.role === 'judge' && caseData.status !== 'closed' && (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="contained"
                        onClick={() => {
                          setNewStatus('closed');
                          setStatusDialog(true);
                        }}
                        sx={{
                          background: 'linear-gradient(90deg, #10b981, #059669)',
                          '&:hover': { background: 'linear-gradient(90deg, #059669, #047857)' }
                        }}
                      >
                        <CheckCircle sx={{ mr: 1 }} /> Close Case
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="contained"
                        onClick={() => {
                          setNewStatus('revoked');
                          setStatusDialog(true);
                        }}
                        sx={{
                          background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                          '&:hover': { background: 'linear-gradient(90deg, #dc2626, #b91c1c)' }
                        }}
                      >
                        <Cancel sx={{ mr: 1 }} /> Revoke Case
                      </Button>
                    </motion.div>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Case Details Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3
              }}
            >
              <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2 }}>
                Case Details
              </Typography>
              <List dense>
                <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <ListItemText
                    primary="Case Type"
                    secondary={caseData.case_type}
                    primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#fff' }}
                  />
                </ListItem>
                <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <ListItemText
                    primary="Citizen"
                    secondary={`${caseData.citizen_first_name || 'N/A'} ${caseData.citizen_last_name || ''}`}
                    primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#fff' }}
                  />
                </ListItem>
                <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <ListItemText
                    primary="Lawyer"
                    secondary={caseData.lawyer_first_name ? `${caseData.lawyer_first_name} ${caseData.lawyer_last_name}` : 'Not Assigned'}
                    primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: caseData.lawyer_first_name ? '#fff' : '#666' }}
                  />
                </ListItem>
                <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <ListItemText
                    primary="Filed Date"
                    secondary={caseData.filed_date ? new Date(caseData.filed_date).toLocaleDateString() : 'N/A'}
                    primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#fff' }}
                  />
                </ListItem>
                {caseData.assigned_date && (
                  <ListItem sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <ListItemText
                      primary="Assigned Date"
                      secondary={new Date(caseData.assigned_date).toLocaleDateString()}
                      primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ color: '#fff' }}
                    />
                  </ListItem>
                )}
                {caseData.closed_date && (
                  <ListItem>
                    <ListItemText
                      primary="Closed Date"
                      secondary={new Date(caseData.closed_date).toLocaleDateString()}
                      primaryTypographyProps={{ color: '#888', fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ color: '#10b981' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialog} 
        onClose={() => setStatusDialog(false)}
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
          {user?.role === 'judge' ? 'Update Case Status & Judgment' : 'Add Legal Remarks'}
        </DialogTitle>
        <DialogContent>
          {user?.role === 'lawyer' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Legal Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              margin="normal"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
                },
                '& .MuiInputLabel-root': { color: '#888' },
                '& .MuiInputBase-input': { color: '#fff' }
              }}
            />
          )}
          
          {user?.role === 'judge' && (
            <>
              <TextField
                fullWidth
                select
                label="Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                  '& .MuiSelect-select': { color: '#fff' }
                }}
              >
                <MenuItem value="pending" sx={{ color: '#000' }}>Pending</MenuItem>
                <MenuItem value="assigned" sx={{ color: '#000' }}>Assigned</MenuItem>
                <MenuItem value="in_progress" sx={{ color: '#000' }}>In Progress</MenuItem>
                <MenuItem value="closed" sx={{ color: '#000' }}>Closed</MenuItem>
                <MenuItem value="revoked" sx={{ color: '#000' }}>Revoked</MenuItem>
              </TextField>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Legal Remarks (Optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Judgment"
                value={judgment}
                onChange={(e) => setJudgment(e.target.value)}
                margin="normal"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                  },
                  '& .MuiInputLabel-root': { color: '#888' },
                  '& .MuiInputBase-input': { color: '#fff' }
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setStatusDialog(false)} sx={{ color: '#888' }}>Cancel</Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleStatusUpdate} 
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
                '&:hover': { background: 'linear-gradient(90deg, #00b8e6, #6c2dbd)' }
              }}
            >
              Update
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
