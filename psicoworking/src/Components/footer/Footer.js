import "./Footer.css";
import "../main_page/MainPage.css"
function Footer() {
    return (
        <>
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
            <footer>
  <div class="container">
    <div class="row">
      <div class="col-md-4 footer-column">
        <ul class="nav flex-column">
          <li class="nav-item">
            <span class="footer-title">Psicoworking</span>
          </li>
          <li class="nav-item">
            <p>We have the perfect room for your consultations</p>
          </li>
        </ul>
      </div>
      <div class="col-md-4 footer-column">
        <ul class="nav flex-column">
          <li class="nav-item">
            <span class="footer-title">Quick Links</span>
          </li>
          <li class="nav-item">
            <a class="links" href="/about">About us</a>
          </li>
          <li class="nav-item">
            <a class="links" href="/pricing">Pricing</a>
          </li>
          <li class="nav-item">
            <a class="links" href="/signup">Sign Up</a>
          </li>
        </ul>
      </div>
      <div class="col-md-4 footer-column">
        <ul class="nav flex-column">
          <li class="nav-item">
            <span class="footer-title">Contact & Support</span>
          </li>
          <li class="nav-item">
            <span class="nav-link"><i class="fas fa-phone"></i>    +47 45 80 80 80</span>
          </li>
          <li class="nav-item">
            <span class="nav-link">Address</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="text-center"><i class="fas fa-ellipsis-h"></i></div>
    
    <div class="row text-center">
        <span class="copyright quick-links">Copyright &copy; Psicoworking</span>
    </div>
  </div>
</footer>
        </>
    )
};

export default Footer;