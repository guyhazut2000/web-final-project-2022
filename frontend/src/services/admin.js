import http from "../http-common";

class AdminDataService {
  addUser(data) {
    return http.put("/users/add-user", data);
  }

  deleteUser(data) {
    return http.delete("/users/delete-user/" + data, {
      data: { email: data },
    });
  }
}

export default new AdminDataService();
