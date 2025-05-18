import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './components/Home.jsx'
import Signup from './components/authentication/Signup.jsx'
import Signin from './components/authentication/Signin.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element = {<App/>}>
      <Route path='' element = {<Home/>}/>
      <Route path='signup' element={<Signup/>}/>
      <Route path='signin' element={<Signin/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
