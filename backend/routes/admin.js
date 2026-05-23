const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { supabaseAdmin } = require('../database');
    
    const [users, cases, documents] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact' }),
      supabaseAdmin.from('cases').select('id', { count: 'exact' }),
      supabaseAdmin.from('documents').select('id', { count: 'exact' })
    ]);
    
    res.json({
      totalUsers: users.count || 0,
      totalCases: cases.count || 0,
      totalDocuments: documents.count || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

module.exports = router;
