package com.pms.repository;

import com.pms.entity.User;
import com.pms.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByDepartment(String department);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchByKeyword(String keyword);
}