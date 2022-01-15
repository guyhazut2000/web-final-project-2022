import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

const About = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log("About is rendered");

  return user ? (
    <div>
      <Navbar />
      <div className="course-list">
      {user.userType === "teacher" ? (
        <h1>This is a Teacher About page example.</h1>
      ) : (
        <h1>This is a Student About page example.</h1>
      )}
      <h1>
        This Website enable students watch their grades in a responsive website.
      </h1>
      <h1>
        Also, this website allows teachers to make changes in their student
        grades.
      </h1>
      </div>
    </div>
  ) : (
    <div>
      <Navbar />
      <div>
        <h1 style={{fontFamily:'Josefin Slab', fontWeight:600}}>This is The About page.</h1>
      </div>
    </div>
  );
};

export default About;
