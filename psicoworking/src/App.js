import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Navbar
import MainNavbar from "./Components/shared/navbar/main_navbar/MainNavbar";

// Routes
import MainPage from "./Components/main_page/MainPage";
//import SignUpModal from "./Components/sign_up/SignUpModal";
import SignUp from "./Components/sign_up/SignUp";

// Main app
function App() {
  return (
    <div className="App">
      <Router>
        <MainNavbar />
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/about"></Route>
          <Route path="/pricing"></Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          {/* <Route path="/login"></Route> */}
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
