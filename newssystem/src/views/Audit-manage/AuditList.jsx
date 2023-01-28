import React, { useState, useEffect, } from 'react'
import { Table, Space, Tag, Button, notification } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AUDITSTATE, AUDITCOLOR } from '../../util/constant'
export default function AuditList() {
  const [dataSource, setdataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setdataSource(res.data)
      console.log(res.data);
    })
  }, [username]);
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={AUDITCOLOR[auditState]}>{AUDITSTATE[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
      render: (item) => {
        return <Space size="middle">
          {item.auditState === 1 && <Button danger onClick={() => handleConvert(item.id)}>撤销</Button>}
          {item.auditState === 2 && <Button onClick={() => handlePublish(item.id)}>发布</Button>}
          {item.auditState === 3 && <Button onClick={() => handleUpdate(item.id)} type='primary'>更新</Button>}
          {/* <span style={{ color: 'red', cursor: !item.default ? 'pointer' : 'not-allowed' }} onClick={() => { confirmMethod(item) }}>删除</span> */}
        </Space >
      }
    },]
  const handleConvert = id => {
    setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://127.0.0.1:5000/news/${id}`, {
      auditState: 0
    })
    notification.open({
      message: `通知`,
      description:
        `您可以到草稿箱中查看您的新闻`,
      placement: 'bottomRight',
    })
  }
  const handleUpdate = id => {
    navigate(`/news-manage/update/${id}`)
  }
  const handlePublish = id => {
    // setdataSource(dataSource.filter(item => item.id !== id))
    axios.patch(`http://127.0.0.1:5000/news/${id}`, {
      publishState: 2,
      publishTime:Date.now()
    }).then(() => {
      navigate('/publish-manage/published')
      notification.open({
        message: `通知`,
        description:
          `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottomRight',
      })
    })

  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} rowKey={item => item.id} />
    </div>
  )
}
