import User from '../models/usermodel.js';
import { genJWT, genId } from '../helpers/genJwt.js';
import { emailRegister, emailForgtoPassword } from '../helpers/email.js';

const registerUser = async (req, res) => {
  //duplicity
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    const error = new Error('User register');
    return res.status(400).json({ msg: error.message });
  }
  try {
    const user = new User(req.body);
    user.token = genId();
    await user.save();

    //send email
    emailRegister({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({
      msg: 'User register, check your email to confirm your account'
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //EXIST
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('user not found');
    return res.status(404).json({
      msg: error.message
    });
  }
  //CONFIRM
  if (!user.confirm) {
    const error = new Error('count not confirm yet');
    return res.status(403).json({
      msg: error.message
    });
  }
  //PASSWORD
  if (await user.validPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: genJWT(user._id)
    });
  } else {
    const error = new Error('user or password incorrect');
    return res.status(403).json({
      msg: error.message
    });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error('Invalid Token');
    return res.status(403).json({
      msg: error.message
    });
  }

  try {
    userConfirm.confirm = true;
    userConfirm.token = '';
    await userConfirm.save();
    res.json({ msg: 'User confirm' });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

const forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('user not found');
    return res.status(404).json({
      msg: error.message
    });
  }

  try {
    user.token = genId();
    await user.save();

    //send email
    emailForgtoPassword({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({ msg: 'we send you a email wiht the instruccions' });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;
  const tokenValid = await User.findOne({ token });

  if (tokenValid) {
    res.status(200).json({ msg: 'user valid' });
  } else {
    const error = new Error('token not valid');
    return res.status(404).json({
      msg: error.message
    });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = '';
    try {
      await user.save();
      res.json({ msg: 'password update' });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error('token not valid');
    return res.status(404).json({
      msg: error.message
    });
  }
};

const perfil = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  registerUser,
  authenticate,
  confirm,
  forgot,
  validateToken,
  newPassword,
  perfil
};
