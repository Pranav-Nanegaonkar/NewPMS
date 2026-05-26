package com.pms.config;

import com.pms.entity.*;
import com.pms.enums.*;
import com.pms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

//@Component
//@RequiredArgsConstructor
//@Slf4j


//public class DataSeeder implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final ProjectRepository projectRepository;
//    private final ProjectMemberRepository memberRepository;
//    private final SprintRepository sprintRepository;
//    private final TaskRepository taskRepository;
//    private final RoleRepository roleRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        if (userRepository.count() > 0) {
//            log.info("Database already seeded. Skipping...");
//            return;
//        }
//
//        log.info("Seeding demo data...");
//
//        // ── Ensure roles exist ─────────────────────────────────────────────────
//        Role adminRole = ensureRole(UserRole.ADMIN, "Full system access");
//        Role managerRole = ensureRole(UserRole.MANAGER, "Project management access");
//        Role developerRole = ensureRole(UserRole.DEVELOPER, "Development team member");
//        Role testerRole = ensureRole(UserRole.TESTER, "Testing team member");
//
//        String defaultPassword = passwordEncoder.encode("ChangeMe123!");
//
//        // ── Users ──────────────────────────────────────────────────────────────
//        User admin = userRepository.save(User.builder()
//                .fullName("Alice Johnson").email("alice@pms.com")
//                .password(defaultPassword)
//                .role(UserRole.ADMIN).department("Engineering")
//                .enabled(true).accountNonLocked(true)
//                .roles(Set.of(adminRole)).build());
//
//        User manager = userRepository.save(User.builder()
//                .fullName("Bob Smith").email("bob@pms.com")
//                .password(defaultPassword)
//                .role(UserRole.MANAGER).department("Product")
//                .enabled(true).accountNonLocked(true)
//                .roles(Set.of(managerRole)).build());
//
//        User dev1 = userRepository.save(User.builder()
//                .fullName("Carol White").email("carol@pms.com")
//                .password(defaultPassword)
//                .role(UserRole.DEVELOPER).department("Engineering")
//                .enabled(true).accountNonLocked(true)
//                .roles(Set.of(developerRole)).build());
//
//        User dev2 = userRepository.save(User.builder()
//                .fullName("David Lee").email("david@pms.com")
//                .password(defaultPassword)
//                .role(UserRole.DEVELOPER).department("Engineering")
//                .enabled(true).accountNonLocked(true)
//                .roles(Set.of(developerRole)).build());
//
//        User tester = userRepository.save(User.builder()
//                .fullName("Eva Brown").email("eva@pms.com")
//                .password(defaultPassword)
//                .role(UserRole.TESTER).department("QA")
//                .enabled(true).accountNonLocked(true)
//                .roles(Set.of(testerRole)).build());
//
//        // ── Project ────────────────────────────────────────────────────────────
//        Project project = projectRepository.save(Project.builder()
//                .name("E-Commerce Platform").description("Full-stack e-commerce application")
//                .status(ProjectStatus.IN_PROGRESS).priority(Priority.HIGH)
//                .startDate(LocalDate.now().minusMonths(1))
//                .endDate(LocalDate.now().plusMonths(3))
//                .owner(manager).build());
//
//        // ── Project Members ────────────────────────────────────────────────────
//        memberRepository.save(ProjectMember.builder()
//                .project(project).user(dev1).roleInProject(ProjectMemberRole.LEAD).build());
//        memberRepository.save(ProjectMember.builder()
//                .project(project).user(dev2).roleInProject(ProjectMemberRole.MEMBER).build());
//        memberRepository.save(ProjectMember.builder()
//                .project(project).user(tester).roleInProject(ProjectMemberRole.REVIEWER).build());
//
//        // ── Sprint ─────────────────────────────────────────────────────────────
//        Sprint sprint = sprintRepository.save(Sprint.builder()
//                .project(project).name("Sprint 1")
//                .goal("Set up core authentication and product catalog")
//                .status(SprintStatus.ACTIVE)
//                .startDate(LocalDate.now().minusDays(7))
//                .endDate(LocalDate.now().plusDays(7)).build());
//
//        // ── Tasks ──────────────────────────────────────────────────────────────
//        Task parentTask = taskRepository.save(Task.builder()
//                .project(project).sprint(sprint)
//                .title("User Authentication Module")
//                .description("Implement full auth flow")
//                .type(TaskType.FEATURE).status(TaskStatus.IN_PROGRESS)
//                .priority(Priority.CRITICAL).reporter(manager).assignee(dev1)
//                .storyPoints(13).dueDate(LocalDate.now().plusDays(5)).build());
//
//        taskRepository.save(Task.builder()
//                .project(project).sprint(sprint).parentTask(parentTask)
//                .title("JWT token generation").description("Implement JWT signing and validation")
//                .type(TaskType.FEATURE).status(TaskStatus.DONE)
//                .priority(Priority.HIGH).reporter(manager).assignee(dev1)
//                .storyPoints(3).dueDate(LocalDate.now().minusDays(1)).build());
//
//        taskRepository.save(Task.builder()
//                .project(project).sprint(sprint).parentTask(parentTask)
//                .title("Login endpoint").description("POST /auth/login")
//                .type(TaskType.FEATURE).status(TaskStatus.IN_REVIEW)
//                .priority(Priority.HIGH).reporter(manager).assignee(dev1)
//                .storyPoints(2).dueDate(LocalDate.now().plusDays(1)).build());
//
//        taskRepository.save(Task.builder()
//                .project(project).sprint(sprint)
//                .title("Fix null pointer in product search")
//                .description("NPE thrown when searching with empty string")
//                .type(TaskType.BUG).status(TaskStatus.TODO)
//                .priority(Priority.CRITICAL).reporter(tester).assignee(dev2)
//                .storyPoints(1).dueDate(LocalDate.now().plusDays(2)).build());
//
//        taskRepository.save(Task.builder()
//                .project(project)
//                .title("Write API documentation")
//                .description("Swagger/OpenAPI docs for all endpoints")
//                .type(TaskType.DOCUMENTATION).status(TaskStatus.TODO)
//                .priority(Priority.LOW).reporter(manager).assignee(dev2)
//                .storyPoints(2).dueDate(LocalDate.now().plusDays(14)).build());
//
//        log.info("Demo data seeded successfully! Default password for all users: ChangeMe123!");
//    }
//
//    private Role ensureRole(UserRole roleEnum, String description) {
//        return roleRepository.findByName(roleEnum).orElseGet(() ->
//                roleRepository.save(Role.builder()
//                        .name(roleEnum)
//                        .description(description)
//                        .build())
//        );
//    }
//}