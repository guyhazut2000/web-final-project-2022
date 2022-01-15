import React from "react";
import GradesTable from "./GradesTable";
import { useLocation } from "react-router";
import "../css/courseItem.css";
// func component that display course item card
const CourseItem = (props) => {
  const grades = props.item;
  const location = useLocation();
  const courseName = location.pathname.split("/")[2];

  const calculateAverageGrade = (grades) => {
    var totalGrades = 0;
    var totalGradesCounter = 0;
    // console.log(grades);
    grades.labs.forEach((lab) => {
      totalGrades += parseInt(lab.labGrade);
      totalGradesCounter += 1;
    });
    grades.exercises.forEach((exercise) => {
      totalGrades += parseInt(exercise.exerciseGrade);
      totalGradesCounter += 1;
    });
    var avg = totalGrades / totalGradesCounter;
    avg = avg + "";
    return avg.substring(0, 5);
  };
  // alert(courseName);
  // console.log("table grades: ", grades);
  // console.log("Course Item rendered: ", grades);

  return Object.keys(grades).length === 0 ? (
    <div className="container align-items-center">
      {`Currently you don't have grades at ${courseName.toUpperCase()}`}
    </div>
  ) : (
    <div className="container">
      <h1 style={{ margin: "0", fontWeight: 600, fontFamily: "Josefin Slab" }}>
        {" "}
        Course Average: {calculateAverageGrade(grades)}
      </h1>
      <div className="row">
        <div className="col-lg-6 col-sm-6">
          <h2>Lab Grades</h2>
          {grades && <GradesTable item={grades} type={"lab"} />}
        </div>
        <div className="col-lg-6 col-sm-6">
          <h2>Exercise Grades</h2>
          {grades && <GradesTable item={grades} type={"exercise"} />}
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
