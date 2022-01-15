import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CourseItem = ({ item }) => {
  const user = useSelector((state) => state.user.currentUser);
  if (user) {
    switch (user.userType) {
      case "student":
        return (
          <div className="container-fluid">
            <div className="card">
              {item ? (
                <Card>
                  <Card.Body
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Link to={`/course/${item.courseName}`}>
                      Enter {item.courseName.toUpperCase()} Course By Professor{" "}
                      {item.teacher.teacherName}
                    </Link>
                  </Card.Body>
                </Card>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      case "teacher":
        return (
          <>
            <div>
              {item ? (
                <Card>
                  <Card.Body
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Link to={`/course/${item.courseName}`}>
                      Enter {item.courseName.toUpperCase()} Course
                    </Link>
                  </Card.Body>
                </Card>
              ) : (
                ""
              )}
            </div>
          </>
        );

      default:
        console.log("user type is undefined");
        break;
    }
  }
};

export default CourseItem;
