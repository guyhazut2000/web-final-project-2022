import React, { useState } from "react";
import Swal from "sweetalert2";
import AdminDataService from "../../services/admin";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const AddUser = ({title}) => {
  const createNewUser = () => {
    var data = {
      username: username,
      password: password,
      email: email,
      userType: userType.toLowerCase(),
    };
    console.log(data); //?
    AdminDataService.addUser(data)
      .then((response) => {
        console.log(response);
        Swal.fire({
          type: "success",
          title: "User Created!",
          text: `User ${email} created with ${response.data.status}`,
        });
      })
      .catch(function (err) {
        Swal.fire("Error!", "Can't create new user", "error");
        console.log(err);
      });
  };
  //   const createNewCourse = () => {};
  //   const createNewGrade = () => {};
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <>
    <div className="registration-form">
      <form>
        <br />
        <div style={{display:'flex',alignItems:'center', justifyContent:'center', marginBottom:'16px'}}>
          <label style={{fontSize:'40px',fontFamily:'Dancing Script'}}>{title}</label>
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
          style={{width:'100%'}}
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

        <div className="form-group">
    <div className="form-group" style={{display:'flex', alignItems:'center'}}>
      <i className="icon icon-settings" style={{marginRight: '10px'}}></i>
      <TextField
          select
          label="User Type"
          value={userType}
          onChange={handleChange}
          style={{width:'100%'}}
        >
          <MenuItem value={'Teacher'}>Teacher</MenuItem>
          <MenuItem value={'Student'}>Student</MenuItem>
        </TextField>
    </div>
  </div>

        <div className="form-group" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <button
            type="button"
            className="btn btn-block create-account"
            onClick={(e) => createNewUser()}
          >
            Add User
          </button>
        </div>
        <div style={{display:'flex',alignItems:'center', justifyContent:'center'}}>
          <label style={{fontSize:'20px',fontFamily:'Dancing Script'}}>GradeCourse</label>
        </div>
      </form>
    </div>
  </>
  );
};

export default AddUser;
