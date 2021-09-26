import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Navbar
import NavbarTemplate from "./common/navbar/NavbarTemplate";
import { navItems } from "./main_page/navbar_data";

// Routes
import MainPage from "./main_page/MainPage";
import SignUpModal from "./sign_up/SignUpModal";

// Main app
function App() {
  return (
    <div className="App">
      <Router>
        <NavbarTemplate navData={navItems} />
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/about"></Route>
          <Route path="/pricing"></Route>
          <Route path="/signup">
            <SignUpModal />
          </Route>
          <Route path="/login"></Route>
          {/* <Route path="/person/:id" children={<Person />}></Route>
          <Route path="*">
            <Error />
          </Route> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
