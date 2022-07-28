import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select(
        '-password -confirm -token -createdAt -updatedAt -__v'
      );
      return next();
    } catch (error) {
      return res.status(404).json({
        msg: 'invalid session'
      });
    }
  }
  if (!token) {
    const error = new Error('invalid token');
    return res.status(401).json({
      msg: error.message
    });
  }

  next();
};

export default checkAuth;
