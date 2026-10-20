# 📡 CareerSync Student & Skill Backend API Specification
**Author:** Vikas Yadav  
**Role:** Database Architecture & Core Student/Skill Backend Developer  
**Base URL:** `http://localhost:5000/api`  

---

## 1. Student Profile Modular APIs (`/api/profile`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Student | Fetch authenticated student profile |
| `POST` | `/` | Student | Create or update full profile |
| `GET` | `/?department=&minCgpa=&skill=` | Faculty, TPO, Recruiter | Filter and search all student profiles |
| `GET` | `/user/:userId` | Private | Retrieve specific student profile |
| `PUT` | `/placement-status` | Student, TPO, Admin | Update placement cycle state |
| `POST` | `/education` | Student | Add education record |
| `PUT` | `/education/:eduId` | Student | Update specific education record |
| `DELETE`| `/education/:eduId` | Student | Delete education record |
| `POST` | `/skills` | Student | Add or update categorized skill |
| `DELETE`| `/skills/:skillId` | Student | Remove skill |
| `POST` | `/projects` | Student | Add project with tech stack tags |
| `PUT` | `/projects/:projectId` | Student | Update project |
| `DELETE`| `/projects/:projectId` | Student | Delete project |
| `POST` | `/certifications` | Student | Add external certification |
| `DELETE`| `/certifications/:certId`| Student | Delete certification |
| `POST` | `/experience` | Student | Add internship or work experience |
| `PUT` | `/experience/:expId` | Student | Update experience |
| `DELETE`| `/experience/:expId` | Student | Delete experience |
| `POST` | `/achievements` | Student | Add contest or hackathon award |
| `DELETE`| `/achievements/:achId` | Student | Delete achievement |

---

## 2. Skill Assessments & Verification APIs (`/api/assessments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Private | List active assessments (filters: skillName, difficulty) |
| `GET` | `/:id` | Private | Fetch assessment questions (anti-cheat: answers stripped) |
| `POST` | `/:id/submit` | Student | Submit answers, auto-score, and earn verified badge |
| `GET` | `/my/history` | Student | Fetch past attempts, scores, and earned badges |
| `POST` | `/` | Faculty, TPO, Admin | Author new skill test with MCQs |
| `DELETE`| `/:id` | Faculty, Admin | Deactivate or delete test |

---

## 3. Skill-Gap & Role Matching APIs (`/api/skills`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/matching-roles` | Student | Rank all industry roles by student readiness ($0-100\%$) |
| `PUT` | `/target-roles` | Student | Set preferred target career tracks |
| `GET` | `/my-target-gaps` | Student | Get readiness summaries for all selected target roles |
| `GET` | `/gap/:roleId` | Private | In-depth gap report with recommended courses & tests |
| `GET` | `/analytics/department-gap` | Faculty, TPO | Aggregate top skill deficits across department/batch |
| `GET` | `/roles` | Private | List predefined industry roles with filters |
| `POST` | `/roles` | Admin, TPO, Recruiter | Author industry role benchmarks |
| `GET` | `/roles/:id` | Private | Get single industry role details |
| `PUT` | `/roles/:id` | Admin, TPO, Recruiter | Update industry role |
| `DELETE`| `/roles/:id` | Admin, TPO | Remove industry role |

---

## 4. Learning Hub & Training APIs (`/api/learning`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/?type=&difficulty=&skill=` | Private | Discover courses, bootcamps, and workshops |
| `GET` | `/:id` | Private | View resource details and student enrollment state |
| `POST` | `/:id/enroll` | Student | Enroll in course or workshop |
| `PUT` | `/enrollments/:enrollmentId/progress`| Student | Update progress percentage ($100\%$ grants certificate) |
| `GET` | `/my/enrollments` | Student | View enrolled programs and completion stats |
| `POST` | `/` | Faculty, TPO, Admin | Author new training course/workshop |
| `PUT` | `/:id` | Faculty, TPO, Admin | Update training program details |
| `DELETE`| `/:id` | Faculty, TPO, Admin | Remove training resource |
| `GET` | `/:id/students` | Faculty, TPO, Admin | Attendance & enrolled roster |

---

## 5. ATS Resume Builder & Portfolio APIs (`/api/resume`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Student | Get compiled ATS JSON data and real-time score |
| `PUT` | `/` | Student | Update templates (`modern`, `classic`), styling, and visibility |
| `POST` | `/share` | Student | Generate/toggle public shareable portfolio slug |
| `GET` | `/portfolio/:slug` | Public | Public portfolio page access |
