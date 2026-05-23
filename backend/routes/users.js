const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const { supabaseAdmin } = require('../database');
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, first_name, last_name, is_active, created_at');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { supabaseAdmin } = require('../database');
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, first_name, last_name, phone, is_active, created_at')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'User not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user' });
  }
});

// Update user
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (typeof isActive === 'boolean') updates.is_active = isActive;
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

module.exports = router;
