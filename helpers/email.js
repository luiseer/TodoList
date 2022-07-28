import nodemailer from 'nodemailer';

export const emailRegister = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // info email

  const info = await transport.sendMail({
    from: '"Uptask -Administrador de Proyectis" <cuentas@uptask.com>',
    to: email,
    subject: 'Welcome to Uptask',
    text: `Confirm your account ${name}`,
    html: `
      <p>Hi ${name}, welcome to Uptask, please confirm your email by clicking the link below:</p>
      <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm acount</a>
      <p>If you did not request this, please ignore this email</p>`
  });
};

//TODO: move to entorn variables
export const emailForgtoPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // info email

  const info = await transport.sendMail({
    from: '"Uptask -Administrador de Proyectis" <cuentas@uptask.com>',
    to: email,
    subject: 'Reset your password',
    text: `hi ${name}, reset your password `,
    html: `
      <p>Hi ${name}, You have requested to reset your password:</p>
      <p>follow the link bellow to reset your password</p>
      <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset Password</a>
      <p>if you did not request the password change, enter this email</p>
      `
  });
};
