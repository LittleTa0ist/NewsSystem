import {
  UserOutlined,
  HomeOutlined,
  ControlOutlined,
  SoundOutlined,
  AuditOutlined,
  SmileOutlined,
  NotificationTwoTone

} from '@ant-design/icons';
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import './index.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ChangeCollapse } from '../../redux/action/change_collapse';
import { connect } from 'react-redux'

const { Sider } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/right-manage": <ControlOutlined />,
  "/news-manage": <SoundOutlined />,
  "/audit-manage": <AuditOutlined />,
  "/publish-manage": <SmileOutlined />

}

// const a = [
//   getItem((
//     <NavLink to='/home'>
//       首页
//     </NavLink>), '/home', <UserOutlined />),
//   getItem('用户管理', '/user-manage', <VideoCameraOutlined />, [
//     getItem((
//       <NavLink to='/user-manage/list'>
//         用户列表
//       </NavLink>), '/user-manage/list')
//   ]),
//   getItem('权限管理', '/right-manage', <UploadOutlined />, [
//     getItem((
//       <NavLink to='/right-manage/role/list'>
//         角色列表
//       </NavLink>), '/right-manage/role/list'),
//     getItem((
//       <NavLink to='/right-manage/right/list'>
//         权限列表
//       </NavLink>), '/right-manage/right/list')
//   ])
// ];



function SlideMenu(props) {

  const [items, setItems] = useState([])
  const { pathname } = useLocation()
  const front_path = '/' + pathname.split('/')[1]
  useEffect(() => {
    const { role: { rights } } = localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : {
        role: { rights: [] },
      };
    const recursion = (arr) => {
      return arr.map(item => {
        if (item.pagepermisson && rights.includes(item.key)) {
          return getItem((
            item.children && item.children.length > 0 ? item.title :
              <NavLink to={item.key}>
                {item.title}
              </NavLink>), item.key, iconList[item.key], item.children?.length > 0 ? recursion(item.children) : null)
        }
        else return null

      })
    }
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setItems(recursion(res.data))
    })
  }, [])

  return (
    <Sider theme='light' trigger={null} collapsible collapsed={props.isCollapse}>
      <div style={{ display: 'flex', height: "100%", flexDirection: 'column' }}>
        {props.isCollapse ? <NotificationTwoTone  style={{
          fontSize: '18px', lineHeight: '36px', textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }} twoToneColor={'darkgoldenrod'}/> : <div className="logo">全球新闻发布管理系统</div>}

        <div style={{ flex: 1, overflow: 'auto' }}>
          <Menu
            theme="light"
            mode="inline"
            defaultOpenKeys={[front_path]}
            selectedKeys={[pathname]}
            items={items}
          />
        </div>

      </div>

    </Sider>
  )
}

export default connect(
  state => ({
    isCollapse: state.isCollapsedReducer.isCollapsed
  }),
  //API层面简便写法
  {
    ChangeCollapse
  }
)(SlideMenu)
