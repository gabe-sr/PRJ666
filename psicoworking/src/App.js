import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Navbar
import MainNavbar from "./Components/shared/navbar/main_navbar/MainNavbar";

// Routes
import MainPage from "./Components/main_page/MainPage";
import SignUp from "./Components/sign_up/SignUp";
import Dashboard from "./Components/dashboard/Dashboard";

// TESTING
import TableData from "./Components/shared/table-data/TableData";

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
          <Route exact path="/user/:id" render={(props) => (
              <Dashboard id={props.match.params.id}/>
          )} />

          {/*for testing...*/}
          <Route path="/table">
            <TableData />
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
