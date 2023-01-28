import axios from 'axios'
import React from 'react'
import { Table, Space, Button } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
export default function Audit() {
  const [dataSource, setSource] = useState([])
  const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setSource(roleId === 1 ? list : [
        ...list.filter((item) => item.author === username),
        ...list.filter((item) => item.roleId === 3 && item.region === region)
      ])
    })
  }, [roleId, username, region])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>
          {title}
        </NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
      render: (item) => {
        return <Space size="middle">
          <Button type='primary' shape='circle' icon={<CheckOutlined />} onClick={() => { handleCheck(item.id) }}></Button>
          <Button danger shape='circle' icon={<CloseOutlined />} onClick={() => { handleReject(item.id) }}></Button>
          {/* <span style={{ color: 'red', cursor: !item.default ? 'pointer' : 'not-allowed' }} onClick={() => { confirmMethod(item) }}>删除</span> */}
        </Space >
      }
    },]
  const handleCheck = id => {
    setSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://127.0.0.1:5000/news/${id}`, {
      auditState: 2,
      publishState: 1
    })
  }
  const handleReject = id => {
    setSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://127.0.0.1:5000/news/${id}`, {
      auditState: 3,
      publishState: 0
    })
  }
  return (
    <div> <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} rowKey={item => item.id} /></div>
  )
}
