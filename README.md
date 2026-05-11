# 🚀 TeamFlow Pro: Enterprise Task Management Platform

TeamFlow is a high-performance, professional-grade workspace designed for modern organizations. It features a robust Kanban system, sophisticated role-based access control (RBAC), and a premium design system tailored for both administrative oversight and team execution.

---

## 💎 Core Features

### 🏢 Organizational Management
- **Role-Based Access**: Specialized views and permissions for **Administrators** and **Team Members**.
- **User Onboarding**: Admins can directly onboard new members via email and name.
- **Member Profiles**: Comprehensive profile intelligence with availability and contact tracking.

### 📋 Advanced Task Orchestration
- **Responsive Kanban**: A smart 3-column stacked layout optimized for single-screen views without horizontal overflow.
- **Overdue Intelligence**: Automated tracking of late submissions, including precise day-count calculations and late-tagging.
- **Submission Workflow**: Seamless transitions from active execution to administrative review.

### 📈 Strategic Insights
- **Live Analytics**: Real-time dashboard with status distribution, workload composition, and team velocity metrics.
- **Performance Reports**: Detailed analytics for operational excellence.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **State Management** | React Query (TanStack) |
| **Security** | JWT Authentication, Bcrypt.js |
| **Theme System** | Next-Themes (Light/Dark Mode Support) |

---

## 📂 Project Structure

```text
TeamFlow/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router & Pages
│   │   ├── components/    # Professional UI Components
│   │   ├── context/       # Auth & State Context
│   │   └── lib/           # API Utilities
│   └── tailwind.config.ts
├── server/                 # Node.js Backend
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # API Endpoints
│   ├── controllers/       # Business Logic
│   └── middleware/        # Security & RBAC
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TeamFlow.git
cd TeamFlow
```

### 2. Configure Environment
Create `.env` files in both the `client` and `server` directories (refer to `.env.example`).

### 3. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 4. Run Development Environment
```bash
# Start Backend (from server directory)
npm run dev

# Start Frontend (from client directory)
npm run dev
```

---

## 🌐 Deployment (Railway)

TeamFlow is architected for easy deployment on **Railway.app**. 

1. Create a new Railway project and connect your GitHub repo.
2. Add a service for the **Server** (Root: `/server`, Variables: `MONGO_URI`, `JWT_SECRET`).
3. Add a service for the **Client** (Root: `/client`, Variable: `NEXT_PUBLIC_API_URL`).

Demo Credentials

-Email: admin@gmail.com
-password: admin@123

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by the TeamFlow Engineering Team.
