const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../database');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.userId)
      .limit(1);
    
    if (error) throw error;
    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
