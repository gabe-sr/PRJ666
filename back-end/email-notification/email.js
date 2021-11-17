import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1b860077428227",
    pass: "9ac1417c0ad4bd",
  },
});

export let mailOptionsReview = (email, name) => ({
  from: '"Psicoworking Team" <psicoworking@gmail.com>',
  to: `${email}`,
  subject: "PSICOWORKING: Your application is under review",
  text: "Thanks for joining Psicoworking!",
  html: `
  ${style}
  <div class="container">
    <div class="header-banner">
      <h1>Psicoworking</h1>
    </div>
    <div class="main-body">
      <h3>Hi ${name}, </h3>
      <p>Thanks for joining Psicoworking! </p>
      <p>This is to inform that we have received your application.</p>
      <p>Our team is currently reviewing it and you should receive a confirmation message <b>within 48 hours</b>.</p>
      <p>If you have any questions, please contact us at: 
          <a class="link" href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a>
        </p>
        <br/>
        <p>Thanks,
          <br/>
          <hr/>
          <h4>Psicoworking Team</h4>
          <p>
            <small>Visit us at 
              <a class="link" href="https://psicoworking.herokuapp.com">psicoworking.com</a>
            </small>
          <p>
    </div>
  </div>
  `,
});

export let mailOptionsApprove = (email, name) => ({
  from: '"Psicoworking Team" <psicoworking@gmail.com>',
  to: `${email}`,
  subject: "PSICOWORKING: Your application has been approved!",
  text: "Your application was approved!",
  html: `${style}
  <div class="container">
    <div class="header-banner">
      <h1>Psicoworking</h1>
    </div>
    <div class="main-body">
      <h3>Hi ${name}, </h3>
      <p>This is to inform that your application has been approved.</p>
      <p>You can now visit <a href="https://psicoworking.herokuapp.com">psicoworking.com</a> and sign in into your account.</p>
      <p>If you have any questions, please contact us at: 
        <a class="link" href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a>
      </p>
      <br/>
      <p>Thanks,
        <br/>
        <hr/>
        <h4>Psicoworking Team</h4>
        <p>
          <small>Visit us at 
            <a class="link" href="https://psicoworking.herokuapp.com">psicoworking.com</a>
          </small>
        <p>
    </div>
  </div>
  `,
});

export let mailOptionsRedefine = (name, email, link) => ({
  from: '"Psicoworking Team" <psicoworking@gmail.com>',
  to: `${email}`,
  subject: "PSICOWORKING: Your password reset link",
  text: "Your password reset link",
  html: `
  ${style}
  <div class="container">
    <div class="header-banner">
      <h1>Psicoworking</h1>
    </div>
    <div class="main-body">
      <h3>Hi ${name}, </h3>
      <p>There was a request to change your password!</p>
      <p>If you did not make this request then please ignore this email.</p>
      <p>Otherwise, please click on the button bellow to change your password:</p>
      <br/><br/>
      <a class="btn" href="http://localhost:3000/redefine/${link}">Redefine password</a>
      <br/><br/>
      <p>If you have any questions, please contact us at: 
        <a class="link" href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a>
      </p>
      <br/>
      <p>Thanks,
        <br/>
        <hr/>
        <h4>Psicoworking Team</h4>
        <p>
          <small>Visit us at 
            <a class="link" href="https://psicoworking.herokuapp.com">psicoworking.com</a>
          </small>
        <p>
    </div>
  </div>
  `,
});

// Email styling
const style = `<style>
.container {
  font-family: "Tahoma";
  margin: 0 auto;
  border: 1px solid #3f3f3f;
  width: 95%;
  background-color: #fff;
}
.header-banner {
  font-weight: bold;
  background-color: #f39a71;
  color: #fff;
  padding: 0.1rem 1rem;
}
.main-body {
  margin: 0px 20px;
  color: #3f3f3f;
}
.btn {
  margin: 10px 0;
  text-decoration: none;
  border-radius: 10px;
  background-color: #6f6f6f;
  color: #fff;
  padding: 6px 13px;
}
.link {
  text-decoration: none;
  color: #f39a71;
  font-weight: bold;
}
</style>`;
