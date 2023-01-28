import React, { useState, useEffect, useRef } from 'react'
import { Table, Space, Modal, Switch, Button } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'

import UserForm from '../../components/User-manage/UserForm';
const { confirm } = Modal;


export default function UserList() {
  const [dataSource, setSource] = useState([])
  const [open, setOpen] = useState(false)
  const [updateOpen, setupdateOpen] = useState(false)
  const [regionList, setregionList] = useState([])
  const [roleList, setroleList] = useState([])
  const [currentItem, setcurrentItem] = useState(null)
  const [isUpdateDisabled, setUpdateDisabled] = useState(false)
  const userFormRef = useRef(null)
  const updateFormRef = useRef(null)
  const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))
  // 获取用户列表
  useEffect(() => {
    axios.get('http://localhost:5000/users?_expand=role').then(res => {
      const list = res.data
      setSource(roleId === 1 ? list : [
        ...list.filter((item) => item.username === username),
        ...list.filter((item) => item.roleId === 3 && item.region === region)
      ])
    })
  }, [roleId, username, region])
  // 获取区域列表
  useEffect(() => {
    axios.get('http://localhost:5000/regions').then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])
  // 获取角色列表
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region ? region : '全球'}</b>
      },
      filters: [...regionList.map(item => ({
        text: item.title,
        value: item.value
      })), {
        text: '全球',
        value: ''
      }],
      onFilter: (value, item) => value === item.region
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
      render: (item) => {
        return <Space size="middle">
          <span style={{ color: '#1677ff', cursor: !item.default ? 'pointer' : 'not-allowed' }} onClick={() => updateMethod(item)}>编辑</span>
          <span style={{ color: 'red', cursor: !item.default ? 'pointer' : 'not-allowed' }} onClick={() => { confirmMethod(item) }}>删除</span>
        </Space >
      }
    },]
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const confirmMethod = (item) => {
    if (item.default) {
      alert('禁止删除')
      return;
    }
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
  const openMethod = () => {
    return new Promise((resolve, reject) => {
      setupdateOpen(true)
      resolve(111)
    })
  }
  const disabdMethod = (item) => {
    return new Promise((resolve, reject) => {
      if (item.roleId === 1) {
        setUpdateDisabled(true)
      } else {
        setUpdateDisabled(false)
      }
      resolve(222)
    })
  }
  // 更新用户
  const updateMethod = async (item) => {
    if (item.default) {
      alert('禁止编辑')
      return;
    }
    setcurrentItem(item)
    await openMethod()
    await disabdMethod(item)
    updateFormRef.current.setFieldsValue(item)
  }
  const updateUser = () => {
    setupdateOpen(false)
    updateFormRef.current.validateFields().then(res => {
      // setSource([
      //   ...dataSource,res
      // ])
      updateFormRef.current.resetFields()
      setSource(dataSource.map(data => {
        if (data.id === currentItem.id) {
          return {
            ...data,
            ...res,
            role: roleList.find(value => {
              return value.id === res.roleId
            })
          }
        }
        return data
      }))
      axios.patch(`http://localhost:5000/users/${currentItem.id}`, {
        ...res
      })


    })
      .catch(err => {
        console.log(err);
      });
  }
  // 删除
  const deleteMethod = (item) => {

    setSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)


  }
  // 添加用户
  const addUser = () => {
    setOpen(false)

    userFormRef.current.validateFields().then(res => {
      // setSource([
      //   ...dataSource,res
      // ])
      userFormRef.current.resetFields()
      axios.post('http://localhost:5000/users', {
        ...res,
        "roleState": true,
        "default": false
      }).then(res => {
        setSource([...dataSource, {
          ...res.data,
          role: roleList.find(value => {
            return value.id === res.data.roleId
          })
        }])
      })

    })
      .catch(err => {
        console.log(err);
      });
  }
  return (
    <div>
      <Button style={{marginBottom:'20px'}} type='primary' onClick={() => setOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} rowKey={item => item.id} />
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={addUser}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={userFormRef} />
      </Modal>
      <Modal
        open={updateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateDisabled(!isUpdateDisabled)
          setTimeout(() => {
            setupdateOpen(false)
          }, 0);


        }}
        onOk={() => {

          setTimeout(() => {
            updateUser()
          }, 0);
          setUpdateDisabled(!isUpdateDisabled)

        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateFormRef} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  )
}
