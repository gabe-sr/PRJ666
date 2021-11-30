import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    // user: "1b860077428227",
    // pass: "9ac1417c0ad4bd",
    user: "65bf9a3142c907",
    pass: "1a38b4a03b359d"
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

export let mailCancelNotice = (name, email, room, booking_date, reason) =>({
  from: `"Psicoworking Team" <psicoworking@gmail.com>`,
  to: `${email}`,
  subject: `Booking Cancellation - ${booking_date}`,
  text: `Booking cancellation notification`,
  html: `${style}
        <div class="container">
          <div class="header-banner">
            <h1>Psicoworking</h1>
          </div>
          <div class="main-body">
            <h3>Hi ${name}, </h3>
            <p>Booking for ${room} on ${booking_date} has been cancelled</p>
            <p>Reason for cancellation was: ${reason}</p>
            <hr/>
            <p>If you didn't request a cancellation, </p>
            <ul>
              <li> Or cancellation reason is other than room maintenance and you had not requested a booking cancellation
              <li> Or you simply want more information on the cancellation,
              <li> Or you have any other questions,
            </ul>
            <p>feel free to contact us at: <a class="link" href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a></p>
            <hr/>
            <br/>
            <br/>
            <p>Regards,
              <br/>
              <h4>Psicoworking Team</h4>
              <p>
                <small>Visit us at 
                  <a class="link" href="https://psicoworking.herokuapp.com">psicoworking.com</a>
                </small>
              </p>
          </div>
        </div>`
});

export let mailConfirmNotice = (name, email, room, booking_date) =>({
  from: `"Psicoworking Team" <psicoworking@gmail.com>`,
  to: `${email}`,
  subject: `Booking Confirmation - ${booking_date}`,
  text: `Booking confimation notification`,
  html: `${style}
        <div class="container">
          <div class="header-banner">
            <h1>Psicoworking</h1>
          </div>
          <div class="main-body">
            <h3>Hi ${name}, </h3>
            <p>${room} has been booked on ${booking_date} for ${name}</p>
            <hr/>
            <p>
              If you didn't request a room, or there is something wrong with your booking, 
              or if you simply want more information about your booking, 
            </p>
            <p>feel free to contact us at: <a class="link" href="mailto:psicoworking@gmail.com">psicoworking@gmail.com</a></p>
            <hr/>
            <br/>
            <br/>
            <p>Regards,
              <br/>
              <h4>Psicoworking Team</h4>
              <p>
                <small>Visit us at 
                  <a class="link" href="https://psicoworking.herokuapp.com">psicoworking.com</a>
                </small>
              <p>
          </div>
        </div>`
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
