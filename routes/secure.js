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

router.post('/retrieve-login', asyncMiddleware(async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  const user = await UserModel.findOne({ email });
  res.status(200).json(user);
}));

module.exports = router;
