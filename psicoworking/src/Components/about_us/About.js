import "./About.css";
import images from "../shared/hook/imagesDataSource";
import Footer from "../footer/Footer"
function About() {
  return (
    <>
      <div className="bg-light">
        <div className="container py-5">
          <div className="row h-100 align-items-center py-5">
            <div className="col-lg-6">
              <h1 className="display-4">About Us</h1>
              <p className="lead text-muted mb-0">Lorem ipsum dolor sit amet</p>
            </div>
            <div className="col-lg-6 d-none d-lg-block container-img">
              <img src={images.roomView} alt="" className=" img-fluid" />
              <div className="block"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-5 px-5 mx-auto">
              <img
                src={images.pri}
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6">
              <i className="fa fa-leaf fa-2x mb-3 text-primary"></i>
              <h2 className="font-weight-light">Pricila</h2>
              <p className="font-italic text-muted mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <i className="fa fa-bar-chart fa-2x mb-3 text-primary"></i>
              <h2 className="font-weight-light">Nathalia</h2>
              <p className="font-italic text-muted mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="col-lg-5 px-5 mx-auto order-1 order-lg-2">
              <img
                src={images.nathalia}
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
export default About;
