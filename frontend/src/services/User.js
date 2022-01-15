import http from "../http-common";

class UserDataService {
  // login user
  login(data) {
    return http.post("/users/login", data);
  }
  // logout user
  logout(data) {
    return http.post("/users/logout", data);
  }
  // get user
  getUser(data) {
    return http.post(`/users/${data.username}`, data);
  }
  getUserByID(id) {
    return http.get(`/users/${id}`);
  }
}

export default new UserDataService();
