import React, { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './views/Login'
import NewsSandBox from './views/NewsSandBox'
import News from './views/News/News'
import Detail from './views/News/Detail'
// import axios from 'axios'
import './App.css'
import AuthRoute from './views/AuthRoute'
export default function App() {
  // const elements = useRoutes(routes)
  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <AuthRoute><NewsSandBox /></AuthRoute>}
        />
        <Route path="/news" element={<News />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Fragment>



  )
}
