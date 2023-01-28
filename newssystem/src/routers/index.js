import React from 'react'
import { Navigate } from 'react-router-dom'
// import Login from '../views/Login'
// import NewsSandBox from '../views/NewsSandBox'
import Home from '../views/Home'
import RightList from '../views/Right-manage/RightList'
import RoleList from '../views/Right-manage/RoleList'
import UserList from '../views/User-manage/UserList'
import NewsDraft from '../views/News-manage/NewsDraft'
import NewsCategory from '../views/News-manage/NewsCategory'
import AddNews from '../views/News-manage/AddNews'
import Audit from '../views/Audit-manage/Audit'
import AuditList from '../views/Audit-manage/AuditList'
import Unpublished from '../views/Publish-manage/Unpublished'
import Published from '../views/Publish-manage/Published'
import Sunset from '../views/Publish-manage/Sunset'
import NewsPreview from '../views/News-manage/NewsPreview'
import NewsUpdate from '../views/News-manage/NewsUpdate'
// import AuthRoute from '../views/AuthRoute'
const routeMap = {
  '/home': <Home />,
  '/user-manage/list': <UserList />,
  '/right-manage/role/list': <RoleList />,
  '/right-manage/right/list': <RightList />,
  '/news-manage/add': <AddNews />,
  '/news-manage/draft': <NewsDraft />,
  '/news-manage/category': <NewsCategory />,
  '/audit-manage/audit': <Audit />,
  '/audit-manage/list': <AuditList />,
  '/publish-manage/unpublished': <Unpublished />,
  '/publish-manage/published': <Published />,
  '/publish-manage/sunset': <Sunset />,
  '/news-manage/preview/:id': <NewsPreview />,
  '/news-manage/update/:id': <NewsUpdate />
}

// const routes = [

//   {
//     path: '/home',
//     element: <Home />
//   },
//   {
//     path: '/user-manage/list',
//     element: <UserList />
//   },
//   {
//     path: '/right-manage/role/list',
//     element: <RoleList />
//   },
//   {
//     path: '/right-manage/right/list',
//     element: <RightList />
//   },
//   {
//     path: '/',
//     element: <Navigate to='/home' />
//   },
//   {
//     path: "*",
//     element: <div>404 Not Found</div>

//   }


// ]
const checkRoute = item => {
  return (item.pagepermisson || item.routepermisson) && routeMap[item.key]
}
const checkUserPermisson = (item, rights) => {
  return rights.includes(item.key)
}

export default function getRoutes(routeList, rights) {
  // console.log(routeList);
  return [...routeList.map(item => {
    if (checkRoute(item) && checkUserPermisson(item, rights)) {
      return {
        path: item.key,
        element: routeMap[item.key]
      }
    }
    return null
    // else return {
    //   path: item.key,
    //   element: <div>404 Not Found</div>
    // }
  }),
  {
    path: "*",
    element: <div>404 Not Found</div>

  },
  {
    path: '/',
    element: <Navigate to='/home' />
  }
  ].filter(item => item !== null)
}
// function index() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/login' element={<Login />} />
//         <Route path="*" element={
//           localStorage.getItem("token")?<NewsSandBox/>:<Navigate to='login' /> }/>
//       </Routes>
//     </BrowserRouter>
//   )
// }
