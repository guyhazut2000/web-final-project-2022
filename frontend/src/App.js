import React from "react";
import "./App.css";
import Home from "./pages/Home";
import CourseList from "./pages/CourseList";
import Course from "./pages/Course";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Admin from "./components/admin/Admin";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route exact path="/course">
          {user ? <CourseList /> : <Login />}
        </Route>
        <Route exact path="/course/:courseName">
          {user ? <Course /> : <Login />}
        </Route>
        <Route path="/home">{user ? <Home /> : <Redirect to="/" />}</Route>
        <Route path="/about" component={About} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </Router>
  );
};

export default App;
