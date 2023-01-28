import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({ children }) {
    if (localStorage.getItem('token')) {
        return <>{children}</>
    }
    // 如果token不存在，重定向到登录路由
    else {
        return <Navigate to='/login' replace />
    }

}
