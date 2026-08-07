import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req,res,next)=>{
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({
            message:"Not authorized"
        })
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );
    // decoded contains { id: userId }
    req.user=decoded;

    // optionally hydrate minimal user info (avoid extra DB calls in every route)
    // but do not trust JWT for isAdmin; middleware should check DB for sensitive ops
    try {
      const u = await User.findById(decoded.id).select('isAdmin');
      if (u) req.user.isAdmin = u.isAdmin;
    } catch (err) {
      // ignore hydration errors; some routes don't require it
    }

    next();
}catch(error){
    return res.status(401).json({
        message:"Invalid token"
    })
    }
}
