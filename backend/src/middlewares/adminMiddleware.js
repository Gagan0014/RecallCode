import User from '../models/User.js'

export const admin = async (req, res, next) => {
  try {
    // ensure req.user exists (from protect middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const caller = await User.findById(req.user.id);
    if (!caller || !caller.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // optionally attach isAdmin to req.user
    req.user.isAdmin = true;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
