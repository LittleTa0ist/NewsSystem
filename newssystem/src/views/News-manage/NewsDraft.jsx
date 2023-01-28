import React, { useState } from 'react';
import { Table, Space, Modal, notification } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'
import { useEffect } from 'react';
import { Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
const NewsDraft = () => {
  const [dataSource, setSource] = useState([])
  const navigate = useNavigate()
  const { confirm } = Modal;
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setSource(res.data)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
          <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => {
            navigate(`/news-manage/update/${item.id}`)
          }}>更新</span>
          <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { confirmMethod(item) }}>删除</span>
          <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => { handleCheck(item.id) }}>提交审核</span>
        </Space>
      }
    }
  ]
  const handleCheck = id => {
    axios.patch(`http://127.0.0.1:5000/news/${id}`, {
      auditState: 1
    }).then(() => {
      navigate('/audit-manage/list')
      notification.open({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight',
      })
    })

  }
  const confirmMethod = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleFilled />,
      content: '确定要删除吗？',
      okText: '是的',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {

      }
    });
  }
  const deleteMethod = (item) => {

    setSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/news/${item.id}`)



  }

  return (
    <Fragment>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
    </Fragment>

  );
}

export default NewsDraft;
