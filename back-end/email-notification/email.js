import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1b860077428227",
    pass: "9ac1417c0ad4bd",
  },
});

export let mailOptionsReview = (email) => ({
  from: '"Psicoworking Team" <psicoworking@gmail.com>',
  to: `${email}`,
  subject: "PSICOWORKING: Your application is under review",
  text: "Thanks for joining Psicoworking!",
  html: `<h3>Thanks for joining Psicoworking! </h3>
        <p>This is to inform that we have received your application.</p>
        <p>Our team is currently reviewing it and you should receive a confirmation message <b>within 48 hours</b>.</p>
        <p>If you have any questions, please contact us at <a href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a>.</p>
        <br/>
        <p>Thanks,<br/>
        <h4>Psicoworking Team</h4>
        <p><small>Visit us at <a href="https://psicoworking.herokuapp.com">psicoworking.com</a></small><p>`,
});

export let mailOptionsApprove = (email) => ({
  from: '"Psicoworking Team" <psicoworking@gmail.com>',
  to: `${email}`,
  subject: "PSICOWORKING: Your application has been approved!",
  text: "Your application was approved!",
  html: `<h3>Welcome to Psicoworking! </h3>
        <p>This is to inform that your application has been approved.</p>
        <p>You can now visit <a href="https://psicoworking.herokuapp.com">psicoworking.com</a> and sign in into your account.</p>
        <p>If you have any questions, please contact us at <a href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a>.</p>
        <br/>
        <p>Thanks,<br/>
        <h4>Psicoworking Team</h4>
        <p><small>Visit us at <a href="https://psicoworking.herokuapp.com">psicoworking.com</a></small><p>`,
});
