# Authentication API Reference

All auth endpoints are prefixed with `/api/v1/auth` and are **publicly accessible** (no JWT required).

All other `/api/v1/**` endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### POST `/api/v1/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Secret@123",
  "role": "DEVELOPER",
  "department": "Engineering"
}
```
Password rules: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`@$!%*?&`).

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "fullName": "John Doe", "email": "john@example.com", "role": "DEVELOPER", ... }
  }
}
```
**Errors:** `400` validation failed · `409` email already exists

---

### POST `/api/v1/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Secret@123",
  "rememberMe": true
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": { "id": 1, "fullName": "John Doe", "email": "john@example.com", "role": "DEVELOPER", ... }
  }
}
```
**Errors:** `401` invalid credentials · `403` account disabled · `423` account locked

---

### POST `/api/v1/auth/change-password`
Change the authenticated user's password. Requires JWT.

**Request Body:**
```json
{
  "currentPassword": "Secret@123",
  "newPassword": "NewSecret@456",
  "confirmPassword": "NewSecret@456"
}
```

**Response `200`:**
```json
{ "success": true, "message": "Password changed successfully" }
```
**Errors:** `400` validation/mismatch · `401` wrong current password

---

### GET `/api/v1/auth/validate`
Validate a JWT token. Requires JWT.

**Response `200`:**
```json
{ "success": true, "data": true }
```

---

## Role-Based Access Control

| Role      | Permissions |
|-----------|-------------|
| ADMIN     | Full access — all endpoints including DELETE users |
| MANAGER   | Create/update/delete projects, manage members |
| DEVELOPER | Create/update tasks, read projects, add comments |
| TESTER    | Read projects/tasks, add comments, update task status |

### Endpoint Restrictions

| Method | Path | Required Role |
|--------|------|---------------|
| DELETE | `/api/v1/users/**` | ADMIN |
| DELETE | `/api/v1/projects/**` | ADMIN, MANAGER |
| POST   | `/api/v1/projects` | ADMIN, MANAGER |
| PUT    | `/api/v1/projects/**` | ADMIN, MANAGER |
| All others | `/api/v1/**` | Any authenticated user |

---

## JWT Token

- Algorithm: HS256
- Expiration: 24 hours (configurable via `jwt.expiration`)
- Claims: `userId`, `email`, `roles`, `iss` (PMS), `iat`, `exp`

---

## Demo Credentials

All seeded users have default password: **`ChangeMe123!`**

| Email | Role |
|-------|------|
| alice@pms.com | ADMIN |
| bob@pms.com | MANAGER |
| carol@pms.com | DEVELOPER |
| david@pms.com | DEVELOPER |
| eva@pms.com | TESTER |
