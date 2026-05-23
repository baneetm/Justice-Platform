const { supabaseAdmin } = require('../database');

// Create case (Citizen)
exports.createCase = async (req, res) => {
  try {
    const { title, description, caseType } = req.body;
    const caseNumber = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const { data, error } = await supabaseAdmin
      .from('cases')
      .insert({
        case_number: caseNumber,
        title,
        description,
        case_type: caseType,
        citizen_id: req.user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create case error:', error);
    res.status(500).json({ message: 'Failed to create case' });
  }
};

// Get all cases for user
exports.getCases = async (req, res) => {
  try {
    let query = supabaseAdmin.from('cases').select('*');

    if (req.user.role === 'citizen') {
      query = query.eq('citizen_id', req.user.id);
    } else if (req.user.role === 'lawyer') {
      query = query.or(`lawyer_id.eq.${req.user.id},and(lawyer_id.is.null,status.eq.pending)`);
    } else if (req.user.role === 'judge') {
      query = query.or(`judge_id.eq.${req.user.id},and(judge_id.is.null,status.eq.assigned)`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ message: 'Failed to get cases' });
  }
};

// Get single case
exports.getCase = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      data.citizen_id === req.user.id ||
      data.lawyer_id === req.user.id ||
      data.judge_id === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get case error:', error);
    res.status(500).json({ message: 'Failed to get case' });
  }
};

// Assign case (Lawyer takes case)
exports.assignCase = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('cases')
      .update({ 
        lawyer_id: req.user.id, 
        status: 'assigned',
        assigned_date: new Date().toISOString()
      })
      .eq('id', id)
      .is('lawyer_id', null)
      .eq('status', 'pending')
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(400).json({ message: 'Case not available or already assigned' });
    }

    res.json(data);
  } catch (error) {
    console.error('Assign case error:', error);
    res.status(500).json({ message: 'Failed to assign case' });
  }
};

// Update case status (Judge)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, legalRemarks, judgment } = req.body;

    const updates = { status };
    if (legalRemarks) updates.legal_remarks = legalRemarks;
    if (judgment) updates.judgment = judgment;
    if (req.user.role === 'judge') updates.judge_id = req.user.id;
    if (status === 'closed' || status === 'revoked') updates.closed_date = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update case error:', error);
    res.status(500).json({ message: 'Failed to update case' });
  }
};
