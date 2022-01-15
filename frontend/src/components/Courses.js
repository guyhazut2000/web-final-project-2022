import React from "react";
import { Container, Row } from "react-bootstrap";
import CourseListItem from "./CourseListItem";

const Courses = (props) => {
  // const courses = useSelector((state) => state.course.coursesList);
  const courses = props.courses;
  // console.log(props.courses);

  return (
    <Container style={{ width: "100%" }}>
      <h1 style={{ margin: "0", fontWeight: 600, fontFamily: "Josefin Slab" }}>
        My Courses:
      </h1>
      <hr />
      {/* <button onClick={refreshList}>refresh course list</button> */}
      <Row className="m-auto"></Row>
      {courses !== null && courses !== [] ? (
        courses.map((item, i) => <CourseListItem item={item} key={i} />)
      ) : (
        <div>
          <h1>You have not signed for any course.</h1>
        </div>
      )}
    </Container>
  );
};

export default Courses;
