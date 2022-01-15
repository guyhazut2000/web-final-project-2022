import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Login from "./Login";

const Home = () => {
  const user = useSelector((state) => state.user.currentUser);
  // console.log("Home page", user);
  // console.log("home is rendered");
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return (
    <div>
      {user === null ? <Login /> : <Navbar />}

      <h1>
        Hello {user !== null ? capitalize(user.username) : ""} Welcome back
      </h1>
      {/* <button onClick={() => dispatch(logoutSuccess(null))}>click</button> */}
    </div>
  );
};

export default Home;
