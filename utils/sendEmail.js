import nodemailer from "nodemailer";

export async function sendMail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  if (!transporter) return false;
  var mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };
  let res;
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
