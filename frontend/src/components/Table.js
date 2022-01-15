import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import TeacherDataService from "../services/Teacher";
import "../css/table.css";

const Table = (props) => {
  // console.log("data", props.data);
  const courseID = props.data.courseID;
  const studentID = props.data.studentID;
  // console.log("propsData", props.data);
  var tableHeadList = props.th;
  var type = props.type;
  var tableData = type === "lab" ? props.data.labs : props.data.exercises;

  const [data, setData] = useState(tableData);
  const UpdateButton = (props) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        var rowKey = props.rowKey;
        var type = props.type;
        var rowID = props.id;
        var oldGrade = props.grade;
        // console.log("props", props);
        // ask for new grade
        const getInput = async () => {
          const { value: newGrade } = await Swal.fire({
            title: "Enter your New Grade",
            input: "text",
            inputLabel: `Your old grade: ${oldGrade}`,
            inputPlaceholder: "Please enter a number between 0-100",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "You need to write something!";
              }
              if (parseInt(value) < 0 || parseInt(value) > 100)
                return "Please enter a valid number between (0-100)";
              else if (isNaN(value)) return "Please enter numbers only";
            },
          });

          if (newGrade) {
            // update grade in db
            var tempData = {
              courseID: courseID,
              studentID: studentID,
              number: rowKey,
              type: type,
              oldGrade: oldGrade,
              newGrade: newGrade,
            };
            console.log("data = ", tempData);
            TeacherDataService.updateGrade(tempData)
              .then((res) => {
                console.log(res.data);
                if (res.data !== null) {
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }
                // window.location.reload();
                setTimeout(function () {
                  window.location.reload();
                }, 2000);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };
        getInput();
      }}
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );
  // delete grade from table
  const DeleteButton = (props) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        var rowKey = props.rowKey;
        var type = props.type;
        var rowID = props.id;
        console.log("props", props);
        // console.log(type === "lab");
        // display verification msg.
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
          .then((result) => {
            if (result.isConfirmed) {
              // delete grade from DB.
              var temp = { type: type, _id: rowID };
              console.log(temp);
              TeacherDataService.deleteGrade(temp)
                .then((res) => {
                  console.log(res.data);
                  console.log(`Row ${rowKey} deleted successfully`);
                  // Swal.fire({
                  //   position: "top-end",
                  //   icon: "success",
                  //   title: "Your work has been saved",
                  //   showConfirmButton: false,
                  //   timer: 1000,
                  // });
                })
                .catch((e) => {
                  console.log(e.message);
                });
              // update displayed table
              if (type === "lab") {
                // delete grade from ui table
                setData(
                  data.filter((lab) => {
                    return lab.labNumber !== rowKey;
                  })
                );
                // Swal.fire(
                //   "Deleted!",
                //   "Grade has been deleted successfully.",
                //   "success"
                // );
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Grade has been deleted successfully.",
                  showConfirmButton: false,
                  timer: 4000,
                });
                // window.location.reload();
                setTimeout(function () {
                  window.location.reload();
                }, 2000);
              } else if (type === "exercise") {
                // delete grade from ui table
                setData(
                  data.filter((exercise) => {
                    return exercise.exerciseNumber !== rowKey;
                  })
                );
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Grade has been deleted successfully.",
                  showConfirmButton: false,
                  timer: 4000,
                });
                // window.location.reload();
                setTimeout(function () {
                  window.location.reload();
                }, 2000);
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );

  return (
    <div>
      <table className="table">
        <thead className="table-thead">
          <tr>
            {tableHeadList
              ? tableHeadList.map((th, i) => <th key={i}>{th}</th>)
              : ""}
          </tr>
        </thead>
        <tbody className="table-tbody">
          {data.map((rowData, i) => (
            <tr
              key={type === "lab" ? rowData.labNumber : rowData.exerciseNumber}
            >
              <td>
                {type === "lab" ? rowData.labNumber : rowData.exerciseNumber}
              </td>
              <td>
                {type === "lab" ? rowData.labGrade : rowData.exerciseGrade}
              </td>
              <td>
                <UpdateButton
                  rowKey={
                    type === "lab" ? rowData.labNumber : rowData.exerciseNumber
                  }
                  type={type}
                  id={rowData._id}
                  grade={
                    type === "lab" ? rowData.labGrade : rowData.exerciseGrade
                  }
                />
                <DeleteButton
                  rowKey={
                    type === "lab" ? rowData.labNumber : rowData.exerciseNumber
                  }
                  type={type}
                  id={rowData._id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
