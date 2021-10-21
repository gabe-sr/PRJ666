import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import AuthContext from "./Components/shared/auth-context/AuthContext";

// Routes

import Error from "./Components/error-pages/Error";

// Provisory AUTHORIZATION route

import ProtectedRoutes from "./ProtectedRoutes";
import MainNavbar from "./Components/shared/navbar/main_navbar/MainNavbar";
import MainPage from "./Components/main_page/MainPage";
import SignUp from "./Components/sign_up/SignUp";

// Main app
function App() {
  const [isAuth, setAuth] = useState(false);
  const value = useMemo(() => ({ isAuth, setAuth }), [isAuth]);

  return (
    <AuthContext.Provider value={value}>
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
    </AuthContext.Provider>
  );
}

export default App;
