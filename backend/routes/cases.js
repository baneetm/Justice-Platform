const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Citizen: Create case
router.post('/', authorize('citizen'), caseController.createCase);

// All roles: Get cases
router.get('/', caseController.getCases);

// All roles: Get single case
router.get('/:id', caseController.getCase);

// Lawyer: Assign to case
router.post('/:id/assign', authorize('lawyer'), caseController.assignCase);

// Judge: Update case status
router.patch('/:id/status', authorize('judge', 'admin'), caseController.updateStatus);

module.exports = router;
