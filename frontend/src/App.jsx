import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded'

import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import LiffRoute from './routes/LiffRoute.jsx'
import { ROLES } from './utils/constants.js'

import Home from './pages/public/Home.jsx'
import Login from './pages/public/Login.jsx'
import Register from './pages/public/Register.jsx'
import ForgotPassword from './pages/public/ForgotPassword.jsx'
import CheckStatus from './pages/public/CheckStatus.jsx'
import NotFound from './pages/public/NotFound.jsx'
import Unauthorized from './pages/public/Unauthorized.jsx'

import Notifications from './pages/shared/Notifications.jsx'
import Profile from './pages/shared/Profile.jsx'
import Settings from './pages/shared/Settings.jsx'

import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx'
import CreateRepairRequest from './pages/citizen/CreateRepairRequest.jsx'
import TrackRepairStatus from './pages/citizen/TrackRepairStatus.jsx'
import RepairHistory from './pages/citizen/RepairHistory.jsx'

import OperatorDashboard from './pages/operator/OperatorDashboard.jsx'
import RepairRequests from './pages/operator/RepairRequests.jsx'
import RequestDetails from './pages/operator/RequestDetails.jsx'
import ManageUsers from './pages/operator/ManageUsers.jsx'

import TechnicianDashboard from './pages/technician/TechnicianDashboard.jsx'
import AssignedJobs from './pages/technician/AssignedJobs.jsx'
import JobDetails from './pages/technician/JobDetails.jsx'

const citizenMenu = [
  { path: '/citizen', label: 'แดชบอร์ด', icon: <DashboardRoundedIcon /> },
  { path: '/citizen/create', label: 'แจ้งซ่อมใหม่', icon: <AddCircleRoundedIcon /> },
  { path: '/citizen/track', label: 'ติดตามสถานะ', icon: <TimelineRoundedIcon /> },
  { path: '/citizen/history', label: 'ประวัติแจ้งซ่อม', icon: <HistoryRoundedIcon /> },
  { path: '/citizen/notifications', label: 'การแจ้งเตือน', icon: <NotificationsRoundedIcon /> },
  { path: '/citizen/profile', label: 'โปรไฟล์', icon: <PersonRoundedIcon /> },
  { path: '/citizen/settings', label: 'ตั้งค่า', icon: <SettingsRoundedIcon /> },
]

const operatorMenu = [
  { path: '/operator', label: 'แดชบอร์ด', icon: <DashboardRoundedIcon /> },
  { path: '/operator/requests', label: 'คำขอแจ้งซ่อม', icon: <AssignmentRoundedIcon /> },
  { path: '/operator/users', label: 'จัดการผู้ใช้', icon: <GroupRoundedIcon /> },
  { path: '/operator/notifications', label: 'การแจ้งเตือน', icon: <NotificationsRoundedIcon /> },
  { path: '/operator/profile', label: 'โปรไฟล์', icon: <PersonRoundedIcon /> },
  { path: '/operator/settings', label: 'ตั้งค่า', icon: <SettingsRoundedIcon /> },
]

const technicianMenu = [
  { path: '/technician', label: 'แดชบอร์ด', icon: <DashboardRoundedIcon /> },
  { path: '/technician/jobs', label: 'งานที่ได้รับมอบหมาย', icon: <EngineeringRoundedIcon /> },
  { path: '/technician/notifications', label: 'การแจ้งเตือน', icon: <NotificationsRoundedIcon /> },
  { path: '/technician/profile', label: 'โปรไฟล์', icon: <PersonRoundedIcon /> },
  { path: '/technician/settings', label: 'ตั้งค่า', icon: <SettingsRoundedIcon /> },
]

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/check-status" element={<CheckStatus />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Citizen — no login page; LiffRoute silently signs the user in via LINE LIFF */}
      <Route
        path="/citizen"
        element={<LiffRoute><DashboardLayout menu={citizenMenu} roleLabel="ผู้แจ้งซ่อม" /></LiffRoute>}
      >
        <Route index element={<CitizenDashboard />} />
        <Route path="create" element={<CreateRepairRequest />} />
        <Route path="track" element={<TrackRepairStatus />} />
        <Route path="history" element={<RepairHistory />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Operator */}
      <Route
        path="/operator"
        element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR]}><DashboardLayout menu={operatorMenu} roleLabel="หัวหน้าช่าง (Operator)" /></ProtectedRoute>}
      >
        <Route index element={<OperatorDashboard />} />
        <Route path="requests" element={<RepairRequests />} />
        <Route path="requests/:id" element={<RequestDetails />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Technician */}
      <Route
        path="/technician"
        element={<ProtectedRoute allowedRoles={[ROLES.TECHNICIAN]}><DashboardLayout menu={technicianMenu} roleLabel="ช่างซ่อม (Technician)" /></ProtectedRoute>}
      >
        <Route index element={<TechnicianDashboard />} />
        <Route path="jobs" element={<AssignedJobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}