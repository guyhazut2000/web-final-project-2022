import "../css/login.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess, loginStart } from "../redux/userRedux";
import { useHistory } from "react-router-dom";
import UserDataService from "../services/User";
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  let history = useHistory();


  console.log("login is rendered");

  const isAdmin = () => {
    return username === "admin" && password === "admin";
  };
  // login
  const login = async (e) => {
    if (username === "" || password === "") {
      Swal.fire(
        "Error!",
        "Login failed! Please fill all of your fields.",
        "error"
      );
      return;
    }
    // check if user is admin
    if (isAdmin()) {
      history.push("/admin");
      return;
    }
    try {
      var user;
      var userOnline = false;
      //  user object data
      var data = { username: username, password: password, email: email };
      dispatch(loginStart());
      // check if the user exist in db.
      var res = await UserDataService.getUser(data);
      // console.log(res, res.data);
      if (res.data === null) {
        Swal.fire("Error!", "Login failed! User is Not Exists.", "error");
        return;
      } else {
        user = res.data;
        // console.log("User Login data:", res.data);
        if (user.isOnline) {
          userOnline = true;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "User is already online.",
          });
        }
        // check if user exists.
        if (userOnline) {
          console.log("user is online already");
          return;
        }
        // login user
        res = await UserDataService.login(data);
        console.log(res.data);
        if (res.data !== null) {
          user = res.data;
          console.log("user login successfully.");
          dispatch(loginSuccess(user));
          Swal.fire("Welcome!", "You Logged in successfully!", "success");
          history.push("/home");
        } else {
          dispatch(loginFailure());
        }
      }
    } catch (error) {
      dispatch(loginFailure());
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="registration-form">
        <form>
          <br />
          <div className="form-icon">
            <span>
              <i className="icon icon-graduation"></i>
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center', justifyContent:'center', marginBottom:'16px'}}>
            <label style={{fontSize:'40px',fontFamily:'Dancing Script'}}>GradeCourse</label>
          </div>
          <div className="form-group" style={{display:'flex', alignItems:'center'}}>
            <i className="icon icon-user" style={{marginRight: '10px'}}></i>
            <TextField
          id="outlined-required"
          label="User Name"
          type='text'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          style={{width:'100%',borderRadius:'30px'}}
        />
          </div>
          <div className="form-group" style={{display:'flex', alignItems:'center'}}>
            <i className="icon icon-lock" style={{marginRight: '10px'}}></i>
            <TextField
          id="outlined-required"
          label="Password"
          type='password'
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          style={{width:'100%',borderRadius:'30px'}}
        />
          </div>
          <div className="form-group" style={{display:'flex', alignItems:'center'}}>
            <i className="icon icon-envelope" style={{marginRight: '10px'}}></i>
            <TextField
          id="outlined-required"
          label="Email"
          type='text'
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          style={{width:'100%',borderRadius:'30px'}}
        />
          </div>
          

          <div className="form-group" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <button
              type="button"
              className="btn btn-block create-account"
              onClick={(e) => login(e)}
            >
              Login
            </button>
          </div>
          <div className="social-media">
            <h5>Sign up with social media</h5>
          <div className="social-icons">
            <a href="#">
              <i className="icon-social-facebook" title="Facebook"></i>
            </a>
            <a href="#">
              <i className="icon-social-google" title="Google"></i>
            </a>
            <a href="#">
              <i className="icon-social-twitter" title="Twitter"></i>
            </a>
          </div>
        <h6 className="mt-5 p-5 text-center text-secondary ">
          Copyright © 2021 . All Rights Reserved.
        </h6>
        </div>
        </form>
        
      </div>
    </>
  );
};

export default Login;
