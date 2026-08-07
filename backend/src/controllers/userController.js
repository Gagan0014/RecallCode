import { createUserService } from '../services/userService.js'

export const createUser = async (req, res) => {
  try {
    // admin check moved to middleware; controller assumes caller is authorized
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err && (err.code === 'DUPLICATE' || err.status === 400)) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await (await import('../models/User.js')).default.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
