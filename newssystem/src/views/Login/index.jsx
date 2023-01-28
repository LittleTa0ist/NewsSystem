import React from 'react'
import './login.css'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ParticlesBg from 'particles-bg'
import axios from 'axios'
export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if (res.data.length === 0) {
        message.error('用户名和密码不匹配！')
      }
      else {

          localStorage.setItem('token', JSON.stringify(res.data[0]))
          navigate('/')      
      }
    })
  };
  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };
  return (
    <div className='login'>
      <ParticlesBg type="random" bg={true} />
      <div className="container">
        <div className="loginlogo">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
