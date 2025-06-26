<h1 align="center">🐨 Koala Cloud Editor</h1>

###

<div align="center">
  <img height="150" src="https://raw.githubusercontent.com/k4saad/Koala-Cloud-Editor/refs/heads/main/frontend/src/assets/images/cool-koala.png"  />
</div>

###

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="40" alt="java logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" height="40" alt="apache logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="40" alt="postgresql logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" alt="git logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/apachemaven/C71A36" height="40" alt="apachemaven logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" height="40" alt="redis logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/docker/2496ED" height="40" alt="docker logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/npm/CB3837" height="40" alt="npm logo"  />
</div>

###
**Koala Cloud Editor** is a full-stack cloud-based python editor that supports real-time project collaboration, user authentication, and seamless project management. It consists of a React-based frontend, a RESTful HTTP server backend, and a WebSocket server for live collaborative editing.

---

## 📁 Project Structure
```
Koala-Cloud-Editor/
├── backend/
│   ├── http_server/         
│   └── websocket_server/    
├── frontend/                
└── README.md
```
---

## 🌐 Frontend

### Built With:
- React.js + Vite
- Tailwind CSS
- Axios

### Directory Highlights:
- `authentication/` – Signin & Signup pages
- `dashboard/` – Editor workspace, project list, etc.
- `common/` – Sidebar, notifications, menu, etc.
- `utils/` – Protected routes and API helpers

### Getting Started:

```bash
cd frontend
npm install
npm run dev
```
---

## 🧠 Backend

### 🧾 HTTP Server (`backend/http_server`)

Handles:

* Authentication (JWT)
* Project Management (Create, Fetch, Delete)
* MongoDB / PostgreSQL connectivity

#### Run Locally:

```bash
cd backend/http_server
mvn clean install
java -cp target/*.jar org.com.Main
```

> Configure settings via: `src/main/resources/sample.application.properties`

---

### ⚡ WebSocket Server (`backend/websocket_server`)

Supports:

* Real-time project collaboration
* JWT verification and project room sync

#### Run Locally:

```bash
cd backend/websocket_server
mvn clean install
java -cp target/*.jar org.com.Main
```

---

## 🐳 Docker (Optional)

Both servers are Docker-ready.

### Build & Run HTTP Server:

```bash
cd backend/http_server
docker build -t koala-http-server .
docker run -p 8080:8080 koala-http-server
```

### Build & Run WebSocket Server:

```bash
cd backend/websocket_server
docker build -t koala-ws-server .
docker run -p 8080:8080 koala-ws-server
```

---

## 🧪 Sample Config

Each backend contains a sample configuration file:

* `backend/http_server/src/main/resources/sample.application.properties`
* `backend/websocket_server/src/main/resources/sample.application.properties`

Update these files to connect to your database and set JWT secrets.

---

## ✅ Features

* 🔐 Secure authentication with JWT
* 📁 Project CRUD API
* 💬 Live collaborative editing via WebSocket
* ⚡ Optimized frontend with Vite + Tailwind
* 🔒 Protected frontend routes

---

## 🧑‍💻 Author

**Saad Khan**
GitHub: [@k4saad](https://github.com/k4saad)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
