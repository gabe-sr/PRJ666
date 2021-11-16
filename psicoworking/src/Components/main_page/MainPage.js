import "./MainPage.css";
 import { useHistory } from "react-router-dom";
import images from "../shared/hook/imagesDataSource"
import { useState } from "react";
import LoginModal from "../login/LoginModal.js";
import useAuthentication from "../shared/hook/useAuthentication"

function MainPage() {
    // custom hook to check if user is/not authenticated (render different navbar links)
    const { isAuth } = useAuthentication();

   const history = useHistory()

  // const redirect = ()=>{
  //   let path = "/dashboard/book"
  //   if(!isAuth){
  //     console.log("here");
  //     //handleLoginModal()
  //   }
  //   history.push(path)
  // }

  // tracks the state of the modal (open/closed)
  const [showModal, setShowModal] = useState(false);
  
  const handleLoginModal = () => {
    setShowModal(!showModal);
  };

  const redirect = () => {
    if(!isAuth){
      handleLoginModal(); 
    }
    else{
      //path = "/dashboard"
      history.push("/dashboard") 
    } 
  };
  return (
    <div className="MainPage">
      <section className="colored-section" id="title">
        <div className="container-fluid">
          {/* <!-- Nav Bar --> */}

          {/* <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="/#">
              Psicoworking
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarTogglerDemo02"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/#">
                    Contact
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/#">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/#">
                    Sign Up / Login
                  </a>
                </li>
              </ul>
            </div>
          </nav> */}

          {/* <!-- Title --> */}

          <div className="row">
            <div className="col-lg-6">
              <h1 className="big-heading">
                Find the perfect room for your consultations.
              </h1>
              <button
                type="button"
                className="btn btn-outline-light btn-lg download-button"
                onClick={redirect}
              >
                Book Now
              </button>
            </div>

            <div className="col-lg-6">
              <img
                className="title-image"
                src={images.roomBeige1}
                alt={"waiting room img"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Features --> */}

      <section className="white-section" id="features">
        <div className="container-fluid">
          <div className="row">
            <div className="feature-box col-lg-4">
              <i className="icon fas fa-check-circle fa-4x"></i>
              <h3 className="feature-title">Easy to use.</h3>
              <p>Book a room for your consult with a couple of clicks.</p>
            </div>

            <div className="feature-box col-lg-4">
              <i className="icon fas fa-bullseye fa-4x"></i>
              <h3 className="feature-title">Variety of Rooms.</h3>
              <p>We have rooms that fit all your needs.</p>
            </div>

            <div className="feature-box col-lg-4">
              <i className="icon fas fa-heart fa-4x"></i>
              <h3 className="feature-title">Amenities.</h3>
              <p>
                All our rooms are equiped with chairs, wifi, air conditioning
                and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Testimonials --> */}

      <section className="colored-section" id="testimonials">
        <div
          id="testimonial-carousel"
          className="carousel slide"
          data-ride="false"
        >
          <div className="carousel-inner">
            <div className="carousel-item active container-fluid">
              <h2 className="testimonial-text">Room 1</h2>
              <img className="testimonial-image" src={images.roomBeige1} alt="room1" />
            </div>
            <div className="carousel-item container-fluid">
              <h2 className="testimonial-text">Room 2</h2>
              <img className="testimonial-image" src={images.roomBlue1} alt="Room 2" />
            </div>
            <div className="carousel-item container-fluid">
              <h2 className="testimonial-text">Room 3</h2>
              <img className="testimonial-image" src={images.roomGreen1} alt="Room 3" />
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#testimonial-carousel"
            role="button"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </a>
          <a
            className="carousel-control-next"
            href="#testimonial-carousel"
            role="button"
            data-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </a>
        </div>
      </section>
      {/* <!-- Pricing --> */}

      <section className="white-section" id="pricing">
        <h2 className="section-heading">
          A Room for Every Psychologist's Needs
        </h2>
        <p>Simple and affordable price plans for your and your patients.</p>

        <div className="row">
          <div className="pricing-column col-lg-4 col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Room 1</h3>
              </div>
              <div className="card-body">
                <h2 className="price-text">$20 / hour</h2>
                <p>Wifi</p>
                <p>Air Conditioning</p>
                <p>Comfortable chairs</p>
                <button
                  className="btn btn-lg btn-block btn-dark"
                  type="button"
                  onClick={redirect}
                >
                  Book this Room
                </button>
              </div>
            </div>
          </div>

          <div className="pricing-column col-lg-4 col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Room 2</h3>
              </div>
              <div className="card-body">
                <h2 className="price-text">$23 / hour</h2>
                <p>Wifi</p>
                <p>Air Conditioning</p>
                <p>Couch and Desk</p>
                <button
                  className="btn btn-lg btn-block btn-dark"
                  type="button"
                  onClick={redirect}
                >
                  Book this Room
                </button>
              </div>
            </div>
          </div>

          <div className="pricing-column col-lg-4">
            <div className="card">
              <div className="card-header">
                <h3>Plan 3</h3>
              </div>
              <div className="card-body">
                <h2 className="price-text">$25 / hour</h2>
                <p>Wifi</p>
                <p>Air Conditioning</p>
                <p>Comfortable chairs</p>
                <button
                  className="btn btn-lg btn-block btn-dark"
                  type="button"
                  onClick={redirect}
                >
                  Book this Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Call to Action --> */}

      <section className="colored-section" id="cta">
        <div className="container-fluid">
          <h3 className="big-heading">
            Find the Perfect Office Room for your Needs Today.
          </h3>
          <button
            className="btn btn-outline-light btn-lg download-button"
            type="button"
          >
            Book Now
          </button>
        </div>
      </section>
      <LoginModal showmodal={showModal} handlemodal={handleLoginModal} redirectTo={"/dashboard/book"}/>
      {/* <!-- Footer --> */}

      <footer className="white-section" id="footer">
        <div className="container-fluid">
          <i className="social-icon fab fa-facebook-f"></i>
          <i className="social-icon fab fa-twitter"></i>
          <i className="social-icon fab fa-instagram"></i>
          <i className="social-icon fas fa-envelope"></i>
          <p>© Copyright 2021 Psicoworking</p>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
