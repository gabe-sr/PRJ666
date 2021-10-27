import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Routes
import ProtectedRoutes from "./Components/routes/ProtectedRoutes";
import MainNavbar from "./Components/shared/navbar/main_navbar/MainNavbar";
import MainPage from "./Components/main_page/MainPage";
import SignUp from "./Components/sign_up/SignUp";
import Error from "./Components/error-pages/Error";

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
          <Route exact path="/contact">
            <h2 className="m-4 text-secondary">Contact us</h2>
          </Route>
          <Route exact path="/about">
            <h2 className="m-4 text-secondary">About us</h2>
          </Route>
          <Route exact path="/pricing">
            <h2 className="m-4 text-secondary">Pricing</h2>
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>

          <Route path="/dashboard" component={ProtectedRoutes} />

          <Route path="/*">
            <div>PUBLIC ERROR</div>
            <Error />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
