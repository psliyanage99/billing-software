package sl.praneeth.billingsoftware.service;

import sl.praneeth.billingsoftware.io.UserRequest;
import sl.praneeth.billingsoftware.io.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String id);
}
