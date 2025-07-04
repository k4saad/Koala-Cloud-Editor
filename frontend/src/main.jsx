import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './components/Home.jsx'
import Signup from './components/authentication/Signup.jsx'
import Signin from './components/authentication/Signin.jsx'
import Mainpage from './components/dashboard/Mainpage.jsx'
import ProtectedRoute from './components/utils/ProtectedRoutes.jsx'
import Projects from './components/dashboard/Projects.jsx'
import Project from './components/dashboard/Project.jsx'
import CollabProject from './components/dashboard/CollabProject.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<App/>}>
      <Route path='' element = {<Home/>}/>
      <Route path='signup' element={<Signup/>}/>
      <Route path='signin' element={<Signin/>}/>
      <Route path='~' element={<ProtectedRoute> <Mainpage /> </ProtectedRoute>}/>
      <Route path='projects' element={<ProtectedRoute> <Projects/> </ProtectedRoute>}/>
      <Route path='projects/:id' element={<ProtectedRoute> <Project/> </ProtectedRoute>}/>
      <Route path='collaborations/projects/:id' element={<ProtectedRoute> <CollabProject/> </ProtectedRoute>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
