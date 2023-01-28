import React, { useState, useEffect } from 'react'
import { Table, Tag, Space, Modal,Switch } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'
export default function RightList() {
  const [dataSource, setSource] = useState([])
  const { confirm } = Modal;
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach((item) => {
        if (item.children.length === 0) item.children = ''
      })
      setSource(list)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return (
          <Tag color='green'>
            {key}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
      render: (item) => {
        return <Space size="middle">
          {/* <span style={{ color: '#1677ff', cursor: 'pointer' }}>编辑</span> */}
          <Switch disabled={item.pagepermisson===undefined} checked={item.pagepermisson} onChange={()=>{switchMethod(item)}}></Switch>
          <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { confirmMethod(item) }}>删除</span>
        </Space>
      }
    },]
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

      },
    });
  }
  const switchMethod=(item)=>{
    item.pagepermisson=!item.pagepermisson
    setSource([...dataSource])
    if(item.grade===1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }
  // 删除
  const deleteMethod = (item) => {
    if (item.grade === 1) {
      setSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }
    else {
      const list = dataSource.filter(data => item.rightId === data.id)
      // list是一个对象列表，存储的是对象的地址，因此list中的东西改变，dataSource中的数据也会改变
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }

  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} />
    </div>
  )
}
