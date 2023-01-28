import React from 'react'
import {connect} from 'react-redux'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChangeCollapse } from '../../redux/action/change_collapse';
import { Layout, theme, Dropdown, Avatar, Space } from 'antd';


const { Header } = Layout;
function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false)
  const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const changeCollapse=()=>{
    props.ChangeCollapse()
  }
  const items = [
    {
      key: '1',
      label: roleName
    },
    {
      key: '2',
      danger: true,
      label: '退出登录',
      onClick: () => { exit() }
    },
  ];
  const exit = () => {
    localStorage.removeItem("token")
    navigate('/login', {
      replace: true
    })
  }
  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      {React.createElement(props.isCollapse ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: changeCollapse,
      })}
      &nbsp;&nbsp;
      首页
      <div style={{ float: 'right', lineHeight: '64px' }}>
        <Space size="middle">
          <span style={{ fontSize: '15px' }}>欢迎 <span style={{ color: '#1980ff' }}>{username}</span> 回来</span>
          <Dropdown menu={{ items }}>
            <Avatar
              style={{
                backgroundColor: '#87d068'
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>

      </div>

    </Header>
  )
}
export default connect(
  state =>({
    isCollapse:state.isCollapsedReducer.isCollapsed
  }),
  //API层面简便写法
  {
    ChangeCollapse
  }
)(TopHeader)