import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import TeacherDataService from "../services/Teacher";
import UserDataService from "../services/User";
import "./newGrade.css";
import { useLocation } from "react-router";

const AddNewGrade = (props) => {
  var grades = props.grades;
  var selectedStudent = props.selectedStudent;

  const location = useLocation();
  const courseName = location.pathname.split("/")[2];

  // var test = [1, 2, 3];
  var students = props.students.filter(
    (student) => student.studentID === selectedStudent
  );
  const obj = students.reduce(
    (o, key) => ({ ...o, [key.studentID]: key.studentName }),
    {}
  );

  // console.log("obg", obj);
  // create new grade
  const handleOnClick = async (e) => {
    e.preventDefault();

    const { value: id } = await Swal.fire({
      title: "Enter grade:",
      html:
        "<div>" +
        '<label for="gradeValue">Grade No</label>' +
        "<br/>" +
        '<input type="text" id="gradeNo"/>' +
        "<br/>" +
        '<label for="exercise">Grade Value</label>' +
        "<br/>" +
        '<input type="text" id="gradeValue"/>' +
        "<br/>" +
        '<div class="swalSelect">' +
        '<input type="radio" id="lab" name="type" value="lab" />' +
        '<label for="lab">Lab</label>' +
        '<input type="radio" id="exercise" name="type" value="exercise" />' +
        '<label for="exercise">exercise</label>' +
        "</div>" +
        "</div>",
      className: "addGradeClass",
      input: "select",
      inputOptions: {
        students: obj,
      },
      inputPlaceholder: "Select a student",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Please Select student from the list";
        }
        if (
          isNaN(document.getElementById("gradeNo").value) ||
          parseInt(document.getElementById("gradeNo").value) < 0 ||
          document.getElementById("gradeNo").value === ""
        ) {
          return "Grade No field - Please fill in positive number.";
        }
        if (
          (grades &&
            grades.labs &&
            grades.labs.includes(
              parseInt(document.getElementById("gradeNo").value)
            )) ||
          (grades &&
            grades.exercises &&
            grades.exercises.includes(
              parseInt(document.getElementById("gradeNo").value)
            ))
        ) {
          return "Grade No field - Grade No already exists. please select different Grade No";
        }
        if (
          isNaN(document.getElementById("gradeValue").value) ||
          parseInt(document.getElementById("gradeValue").value) < 0 ||
          parseInt(document.getElementById("gradeValue").value) > 100 ||
          document.getElementById("gradeValue").value === ""
        ) {
          return "Grade Value field - Please fill in positive number(0-100).";
        }
        if (document.querySelector('input[name="type"]:checked') === null) {
          return "Please select lab or exercise type.";
        }
        var isNumberExists = false;
        switch (document.querySelector('input[name="type"]:checked').value) {
          case "lab":
            grades &&
              grades.labs &&
              grades.labs.forEach((lab) => {
                // console.log(
                //   lab.labNumber ===
                //     parseInt(document.getElementById("gradeNo").value)
                // );
                if (
                  lab.labNumber ===
                  parseInt(document.getElementById("gradeNo").value)
                ) {
                  // console.log("need to return");
                  isNumberExists = true;
                }
              });
            break;
          case "exercise":
            grades &&
              grades.exercises &&
              grades.exercises.forEach((exercise) => {
                // console.log(
                //   exercise.exerciseNumber ===
                //     parseInt(document.getElementById("gradeNo").value)
                // );
                if (
                  exercise.exerciseNumber ===
                  parseInt(document.getElementById("gradeNo").value)
                ) {
                  // console.log("need to return");
                  isNumberExists = true;
                }
              });
            break;

          default:
            break;
        }

        if (isNumberExists)
          return "Grade No field - Grade Number is already exists. please select different Grade Number or update it from the table.";
      },
    });

    if (id) {
      var gradeNo = document.getElementById("gradeNo").value;
      var gradeValue = document.getElementById("gradeValue").value;
      var type = document.querySelector('input[name="type"]:checked').value;
      var userId = id;
      // console.log(gradeNo, gradeValue, type, userId);
      // create new grade in db
      // var tempUser = UserDataService.getUserByID(userId).then((res) => {
      //   if (res.data !== null) {
      //     console.log(res.data);
      //     var tempNewGradeData = {
      //       username: res.data.username,
      //       email: res.data.email,
      //       password: res.data.password,
      //       courseName: courseName,
      //       type: type,
      //       number: gradeNo,
      //       grade: gradeValue,
      //     };
      //     console.log("temp data", tempNewGradeData);
      //     TeacherDataService.AddNewGrade(tempNewGradeData).then((res) => {
      //       console.log(res);
      //     });
      //   }
      // });
      try {
        var res = await UserDataService.getUserByID(userId);
        if (res.data !== null) {
          // console.log(res.data);
          var tempNewGradeData = {
            username: res.data.username,
            email: res.data.email,
            password: res.data.password,
            courseName: courseName,
            type: type,
            number: gradeNo,
            grade: gradeValue,
          };
          // console.log("temp data", tempNewGradeData);
          res = await TeacherDataService.addNewGrade(tempNewGradeData);
          if (res.data !== null) {
            // console.log(res.data);
            // refresh table
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Grade has been added successfully.",
              showConfirmButton: false,
              timer: 1000,
            });
            // window.location.reload();
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          }
        }
      } catch (error) {
        // console.log(error.message);
      }
    }
  };
  return (
    <>
      <button
        onClick={(e) => handleOnClick(e)}
        className="btn btn-block create-account"
      >
        <FontAwesomeIcon icon={faPlus} style={{ paddingRight: "5px" }} />
        Add New Grade
      </button>
    </>
  );
};

export default AddNewGrade;
