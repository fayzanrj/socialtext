const nodemailer = require("nodemailer");

module.exports = async (email, username, subject, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: "babufizz@gmail.com",
        pass: "mkzn lkna fhep snre ",
      },
    });

    const emailSent = await transporter.sendMail({
      from: '"Social Text" <babufizz@gmail.com>',
      to: email,
      subject: subject,
      html: `Hi ${username}, hope you are doing good. Welcome to Social Text. In order to start chatting you need to verify your account. Your verification code is ${code}.`,
    });
    
    return emailSent;
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
