import express from 'express';
import { getAvailability, updateAvailability } from '../controllers/availabilityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as availabilityRepository from '../repositories/availabilityRepository.js';
import * as userRepository from '../repositories/userRepository.js';

const router = express.Router();
//Availability routes
router.get('/public/:linkSuffix', async (req, res) => {
  try {
    const user = await userRepository.findByLinkSuffix(req.params.linkSuffix);
    if (!user) return res.status(404).json({ message: 'Host not found' });
    const data = await availabilityRepository.findByUserId(user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticateToken, getAvailability);
router.put('/', authenticateToken, updateAvailability);

export default router;
