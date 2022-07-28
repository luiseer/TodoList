import jwt from 'jsonwebtoken';

const genJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const genId = () => {
  const random = Math.random().toString(32).substring(2);
  const date = Date.now().toString(32);
  return random + date;
};

export { genJWT, genId };
