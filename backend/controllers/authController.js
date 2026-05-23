const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { supabaseAdmin } = require('../database');
const { validationResult } = require('express-validator');

// Register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, role = 'citizen' } = req.body;

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role,
        first_name: firstName,
        last_name: lastName,
        phone
      })
      .select('id, email, role')
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'User registered successfully',
      user: data
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) throw error;
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check MFA
    if (user.mfa_enabled) {
      if (!mfaToken) {
        return res.status(403).json({ mfaRequired: true });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: mfaToken,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ message: 'Invalid MFA code' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        mfaEnabled: user.mfa_enabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Setup MFA
exports.setupMFA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `JusticePlatform:${req.user.email}`
    });

    await supabaseAdmin
      .from('users')
      .update({ mfa_secret: secret.base32 })
      .eq('id', req.user.id);

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'MFA setup failed' });
  }
};

// Verify MFA
exports.verifyMFA = async (req, res) => {
  try {
    const { token } = req.body;
    
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('mfa_secret')
      .eq('id', req.user.id)
      .limit(1);

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: users[0].mfa_secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    await supabaseAdmin
      .from('users')
      .update({ mfa_enabled: true })
      .eq('id', req.user.id);

    res.json({ message: 'MFA enabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'MFA verification failed' });
  }
};

// Get current user
exports.me = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, first_name, last_name, phone, mfa_enabled')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user' });
  }
};
