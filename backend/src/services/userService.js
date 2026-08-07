import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export async function createUserService({ name, email, password, leetcodeUsername }) {
  if (!name || !email || !password || !leetcodeUsername) {
    const err = new Error('Missing required fields');
    err.status = 400;
    throw err;
  }

  // prevent duplicates (fast path)
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('User already exists');
    err.code = 'DUPLICATE';
    err.status = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashed,
      leetcodeUsername
    });

    const safe = user.toObject();
    delete safe.password;
    return safe;
  } catch (error) {
    // handle race condition duplicate key error from Mongo
    if (error && (error.code === 11000 || error.code === '11000')) {
      const err = new Error('User already exists');
      err.code = 'DUPLICATE';
      err.status = 400;
      throw err;
    }
    throw error;
  }
}
