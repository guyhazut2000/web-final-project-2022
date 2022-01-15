import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutFailure, logoutStart } from "../redux/userRedux";
import UserDataService from "../services/User";
import { useHistory } from "react-router-dom";
import { resetUsersData } from "../redux/userRedux";
import { resetCoursesData } from "../redux/courseRedux";
import { resetGradesData } from "../redux/gradeRedux";
import "../css/navbar.css";

const Navbar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  let history = useHistory();

  // logout
  const logout = (e) => {
    e.preventDefault();
    if (user && user.isOnline) {
      // console.log("logout started:", user);
      dispatch(logoutStart());
      UserDataService.logout(user).then((res) => {
        if (res.data !== null) {
          // console.log("logout success: ", res.data);
          // dispatch(logoutSuccess(null));
          dispatch(resetCoursesData());
          dispatch(resetUsersData());
          dispatch(resetGradesData());
          history.push("/");
        } else {
          dispatch(logoutFailure());
          dispatch(resetCoursesData());
          dispatch(resetUsersData());
          dispatch(resetGradesData());
        }
      });
    } else {
      // console.log("cannot perform logout for user:", user);
      dispatch(logoutFailure());
      dispatch(resetCoursesData());
      dispatch(resetUsersData());
      dispatch(resetGradesData());
    }
  };
  return (
    <div
      className=""
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav className="navbar sticky-top navbar-default">
        <div className="navbar-header">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <label
              style={{
                fontSize: "40px",
                fontFamily: "Dancing Script",
                marginRight: "10px",
              }}
            >
              GradeCourse
            </label>
            <label style={{ fontSize: "16px", fontFamily: "Dancing Script" }}>
              Guy Hazut & Viki Ratson
            </label>
          </div>
        </div>
        <button
          type="button"
          className="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#myGrades-toggle-nav"
          aria-expanded="false"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="myGrades-toggle-nav"
          style={{ flexGrow: "1", alignItems: "center" }}
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a
                href="/home"
                style={{ fontFamily: "Josefin Slab", fontWeight: 600 }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/course"
                style={{ fontFamily: "Josefin Slab", fontWeight: 600 }}
              >
                My Courses
              </a>
            </li>
            <li>
              <a
                href="/about"
                style={{ fontFamily: "Josefin Slab", fontWeight: 600 }}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={logout}
                style={{ fontFamily: "Josefin Slab", fontWeight: 600 }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
