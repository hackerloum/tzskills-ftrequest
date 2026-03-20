const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../config/db');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Open', 'In Progress', 'Completed'];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.get(
  '/',
  [query('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status filter')],
  validateRequest,
  async (req, res, next) => {
    try {
      const { status } = req.query;
      let sql = 'SELECT * FROM feature_requests';
      const params = [];

      if (status) {
        sql += ' WHERE status = ?';
        params.push(status);
      }

      sql += ' ORDER BY created_at DESC';

      const [rows] = await db.query(sql, params);
      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid ID')],
  validateRequest,
  async (req, res, next) => {
    try {
      const [rows] = await db.query('SELECT * FROM feature_requests WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Feature request not found' });
      }
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('priority').isIn(VALID_PRIORITIES).withMessage('Priority must be Low, Medium, or High'),
    body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { title, description, priority, status = 'Open' } = req.body;
      const [result] = await db.query(
        'INSERT INTO feature_requests (title, description, priority, status) VALUES (?, ?, ?, ?)',
        [title, description, priority, status]
      );
      const [newRow] = await db.query('SELECT * FROM feature_requests WHERE id = ?', [result.insertId]);
      res.status(201).json({ success: true, data: newRow[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 255 }),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('priority').optional().isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
    body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const [existing] = await db.query('SELECT * FROM feature_requests WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Feature request not found' });
      }

      const { title, description, priority, status } = req.body;
      const current = existing[0];

      await db.query(
        'UPDATE feature_requests SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?',
        [
          title ?? current.title,
          description ?? current.description,
          priority ?? current.priority,
          status ?? current.status,
          id,
        ]
      );

      const [updated] = await db.query('SELECT * FROM feature_requests WHERE id = ?', [id]);
      res.json({ success: true, data: updated[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:id/status',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
    body('status').isIn(VALID_STATUSES).withMessage('Status must be Open, In Progress, or Completed'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [existing] = await db.query('SELECT id FROM feature_requests WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Feature request not found' });
      }

      await db.query('UPDATE feature_requests SET status = ? WHERE id = ?', [status, id]);
      const [updated] = await db.query('SELECT * FROM feature_requests WHERE id = ?', [id]);
      res.json({ success: true, data: updated[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid ID')],
  validateRequest,
  async (req, res, next) => {
    try {
      const [existing] = await db.query('SELECT id FROM feature_requests WHERE id = ?', [req.params.id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Feature request not found' });
      }
      await db.query('DELETE FROM feature_requests WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Feature request deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
