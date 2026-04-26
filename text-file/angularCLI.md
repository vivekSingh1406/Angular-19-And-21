# ⚙️ Angular CLI (Command Line Interface)

Angular CLI is a tool used to **create, manage, and run Angular applications** easily using commands.

👉 In simple words:
**Angular CLI = Tool to build and control Angular projects from terminal**

---

## 🎯 Why Use Angular CLI?

* Fast project setup
* Automatic file generation
* Built-in server
* Easy build & deployment
* Follows best practices

---

## 🚀 Install Angular CLI

```bash id="r0q8bq"
npm install -g @angular/cli
```

Check version:

```bash id="w4kwc5"
ng version
```

---

## 🔥 Common Angular CLI Commands

---

### ✅ Create New Project

```bash id="pbb36h"
ng new my-app
```

---

### ✅ Run Project

```bash id="qv1h6t"
cd my-app
ng serve
```

👉 Open in browser: `http://localhost:4200`

---

### ✅ Generate Component

```bash id="eq92wl"
ng generate component my-component
```

Short form:

```bash id="w1y22g"
ng g c my-component
```

---

### ✅ Generate Service

```bash id="c4u86m"
ng generate service my-service
```

---

### ✅ Build Project

```bash id="z8a8u9"
ng build
```

---

### ✅ Run Tests

```bash id="u8a6tg"
ng test
```

---

### ✅ Add Routing

```bash id="6h19wh"
ng new my-app --routing
```

---

## 📁 What Angular CLI Creates

* Project structure (`src/`, `app/`, etc.)
* Configuration files (`angular.json`, `tsconfig.json`)
* Starter component (`app.component`)

---

## ⚡ Advantages

* Saves development time
* Reduces manual setup
* Standard project structure
* Easy to scale

---

## 🧠 Summary

| Command  | Purpose          |
| -------- | ---------------- |
| ng new   | Create project   |
| ng serve | Run project      |
| ng build | Build project    |
| ng g c   | Create component |
| ng test  | Run tests        |

---
