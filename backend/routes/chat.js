const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get messages for a case
router.get('/:caseId', authenticate, async (req, res) => {
  try {
    const { supabaseAdmin } = require('../database');
    
    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*, sender:first_name, last_name')
      .eq('case_id', req.params.caseId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// Send message
router.post('/:caseId', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    const { supabaseAdmin } = require('../database');
    
    const { data, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        case_id: req.params.caseId,
        sender_id: req.user.id,
        message
      })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
