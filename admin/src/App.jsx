import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Add from './pages/Add'
import Home from './pages/Home'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { AdminProvider } from './context/authContext'
import { Navigate } from 'react-router-dom';

import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const AppContent = () => {
  return (
    <Routes>
{/*       <Route path='/' element={<Navigate to="/admin/login" />} /> */}

      <Route path='/' element={<Login />} />

      <Route path='/admin/home' element={
        <ProtectedAdminRoute><Home /></ProtectedAdminRoute>
      } />
      <Route path='/admin/add' element={
        <ProtectedAdminRoute><Add /></ProtectedAdminRoute>
      } />
      <Route path='/admin/list' element={
        <ProtectedAdminRoute><List /></ProtectedAdminRoute>
      } />
      <Route path='/admin/orders' element={
        <ProtectedAdminRoute><Orders /></ProtectedAdminRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppContent/>
      </AdminProvider>
    </BrowserRouter>
  )
}

export default App
