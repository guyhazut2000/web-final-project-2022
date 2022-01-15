import http from "../http-common";

class TeacherDataService {
  getAllCoursesByID(userID, data) {
    return http.post(`/courses/${userID}`, data);
  }

  getCourseByNameAndUser(courseName, data) {
    return http.post(`/courses/${courseName}/${data.username}`, data);
  }

  deleteGrade(data) {
    return http.post(`/grades/delete-grade`, data);
  }

  addNewGrade(data) {
    return http.post(
      `/grades/${data.courseName}/${data.username}/add-grade`,
      data
    );
  }

  updateGrade(data) {
    return http.post(
      `/grades/${data.courseID}/${data.studentID}/update-grade`,
      data
    );
  }
  b;
  getCourseGradesByCourseName(courseName) {
    return http.get(`/grades/all-grades/${courseName}`);
  }
}

export default new TeacherDataService();
