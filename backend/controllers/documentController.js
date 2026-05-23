const pool = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload document
exports.uploadDocument = [
  upload.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { caseId } = req.body;

      // Verify user has access to case
      const caseResult = await pool.query(
        'SELECT * FROM cases WHERE id = $1',
        [caseId]
      );

      if (caseResult.rows.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'Case not found' });
      }

      const caseData = caseResult.rows[0];
      const hasAccess = 
        caseData.citizen_id === req.user.id ||
        caseData.lawyer_id === req.user.id;

      if (!hasAccess) {
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ message: 'Access denied' });
      }

      // Save document record
      const result = await pool.query(
        `INSERT INTO documents (case_id, uploaded_by, filename, file_path, file_size, mime_type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          caseId,
          req.user.id,
          req.file.originalname,
          req.file.filename,
          req.file.size,
          req.file.mimetype
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload document' });
    }
  }
];

// Get documents for a case
exports.getDocuments = async (req, res) => {
  try {
    const { caseId } = req.params;

    // Verify access
    const caseResult = await pool.query(
      'SELECT * FROM cases WHERE id = $1',
      [caseId]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const caseData = caseResult.rows[0];
    const hasAccess = 
      req.user.role === 'admin' ||
      caseData.citizen_id === req.user.id ||
      caseData.lawyer_id === req.user.id ||
      caseData.judge_id === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT d.*, u.first_name, u.last_name 
       FROM documents d
       JOIN users u ON d.uploaded_by = u.id
       WHERE d.case_id = $1
       ORDER BY d.created_at DESC`,
      [caseId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to get documents' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT d.*, c.citizen_id, c.lawyer_id, c.judge_id
       FROM documents d
       JOIN cases c ON d.case_id = c.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const doc = result.rows[0];
    const hasAccess = 
      req.user.role === 'admin' ||
      doc.citizen_id === req.user.id ||
      doc.lawyer_id === req.user.id ||
      doc.judge_id === req.user.id;

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', doc.file_path);
    res.download(filePath, doc.filename);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download document' });
  }
};
