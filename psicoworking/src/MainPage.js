import "./MainPage.css";
import roomImage from './images/room.png';

function MainPage() {
  return (
    <div className="MainPage">
        <section class="colored-section" id="title">

<div class="container-fluid">

  {/* <!-- Nav Bar --> */}

  <nav class="navbar navbar-expand-lg navbar-dark">

    <a class="navbar-brand" href="/#">Psicoworking</a>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">

      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="/#">Contact</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/#">Sign Up / Login</a>
        </li>
      </ul>

    </div>
  </nav>


  {/* <!-- Title --> */}

  <div class="row">

    <div class="col-lg-6">
      <h1 class="big-heading">Find the perfect room for your consultations.</h1>
      <button type="button" class="btn btn-outline-light btn-lg download-button">Book Now</button>
    </div>

    <div class="col-lg-6">
    <img className="room-photo" src={roomImage} alt={"waiting room img"}/>
    </div>

  </div>

</div>

</section>


{/* <!-- Features --> */}

<section class="white-section" id="features">

<div class="container-fluid">

  <div class="row">
    <div class="feature-box col-lg-4">
      <i class="icon fas fa-check-circle fa-4x"></i>
      <h3 class="feature-title">Easy to use.</h3>
      <p>Book a room for your consult with a couple of clicks.</p>
    </div>

    <div class="feature-box col-lg-4">
      <i class="icon fas fa-bullseye fa-4x"></i>
      <h3 class="feature-title">Variety of Rooms.</h3>
      <p>We have rooms that fit all your needs.</p>
    </div>

    <div class="feature-box col-lg-4">
      <i class="icon fas fa-heart fa-4x"></i>
      <h3 class="feature-title">Amenities.</h3>
      <p>All our rooms are equiped with chairs, wifi, air conditioning and more.</p>
    </div>
  </div>
</div>
</section>


{/* <!-- Testimonials --> */}

<section class="colored-section" id="testimonials">

<div id="testimonial-carousel" class="carousel slide" data-ride="false">
  <div class="carousel-inner">
    <div class="carousel-item active container-fluid">
      <h2 class="testimonial-text">Room 1</h2>
      <img class="testimonial-image" src="" alt="room1"/>
      <em>Room 2</em>
    </div>
    <div class="carousel-item container-fluid">
      <h2 class="testimonial-text">Room 2</h2>
      <img class="testimonial-image" src="" alt="Room 2"/>
      <em>Room 2</em>
    </div>
  </div>
  <a class="carousel-control-prev" href="#testimonial-carousel" role="button" data-slide="prev">
<span class="carousel-control-prev-icon"></span>
  </a>
  <a class="carousel-control-next" href="#testimonial-carousel" role="button" data-slide="next">
<span class="carousel-control-next-icon"></span>
  </a>
</div>

</section>

{/* <!-- Pricing --> */}

<section class="white-section" id="pricing">

<h2 class="section-heading">A Plan for Every Psychologist's Needs</h2>
<p>Simple and affordable price plans for your and your patients.</p>

<div class="row">

  <div class="pricing-column col-lg-4 col-md-6">
    <div class="card">
      <div class="card-header">
        <h3>Plan 1</h3>
      </div>
      <div class="card-body">
        <h2 class="price-text">$20 / mo</h2>
        <p>Features</p>
        <p>Features</p>
        <p>Features</p>
        <button class="btn btn-lg btn-block btn-outline-dark" type="button">Sign Up</button>
      </div>
    </div>
  </div>

  <div class="pricing-column col-lg-4 col-md-6">
    <div class="card">
      <div class="card-header">
        <h3>Plan 2</h3>
      </div>
      <div class="card-body">
        <h2 class="price-text">$49 / mo</h2>
        <p>Features</p>
        <p>Features</p>
        <p>Features</p>
        <button class="btn btn-lg btn-block btn-dark" type="button">Sign Up</button>
      </div>
    </div>
  </div>

  <div class="pricing-column col-lg-4">
    <div class="card">
      <div class="card-header">
        <h3>Plan 3</h3>
      </div>
      <div class="card-body">
        <h2 class="price-text">$99 / mo</h2>
        <p>Features</p>
        <p>Features</p>
        <p>Features</p>
        <button class="btn btn-lg btn-block btn-dark" type="button">Sign Up</button>

      </div>
    </div>
  </div>



</div>

</section>


{/* <!-- Call to Action --> */}

<section class="colored-section" id="cta">

<div class="container-fluid">

  <h3 class="big-heading">Find the Perfect Office Room for your Needs Today.</h3>
  <button class="download-button btn btn-lg brn-light" type="button">Book Now</button>
</div>
</section>


{/* <!-- Footer --> */}

<footer class="white-section" id="footer">
<div class="container-fluid">
  <i class="social-icon fab fa-facebook-f"></i>
  <i class="social-icon fab fa-twitter"></i>
  <i class="social-icon fab fa-instagram"></i>
  <i class="social-icon fas fa-envelope"></i>
  <p>© Copyright 2021 Psicoworking</p>
</div>
</footer>

    </div>
  );
}

export default MainPage;