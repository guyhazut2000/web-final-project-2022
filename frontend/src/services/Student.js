import http from "../http-common";

class StudentDataService {
  // getAllCourses() {
  //   return http.get("/courses");
  // }

  getAllCoursesByID(id, data) {
    return http.post(`/courses/${id}`, data);
  }

  getCourseByNameAndUser(courseName, data) {
    return http.post(`/courses/${courseName}/${data.username}`, data);
  }

  getStudentGradesByCourse(courseName, data) {
    return http.post(`/grades/${courseName}/${data.username}`, data);
  }
}

export default new StudentDataService();
