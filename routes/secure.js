const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/submit-exp', asyncMiddleware(async (req, res, next) => {
  const { email, exp } = req.body;
  await UserModel.updateOne({ email }, { experiencePoints: exp });
  res.status(200).json({ status: 'ok' });
}));

// router.get('/exp/:user', asyncMiddleware(async (req, res, next) => {
//   const users = await UserModel.find({ email: req.params.user }, 'name experiencePoints -_id');
//   res.status(200).json(users);
// }));

router.get('/exp', asyncMiddleware(async (req, res, next) => {
  const users = await UserModel.find({}, 'name experiencePoints -_id').sort({ experiencePoints: -1}).limit(10);
  res.status(200).json(users);
}));

module.exports = router;
