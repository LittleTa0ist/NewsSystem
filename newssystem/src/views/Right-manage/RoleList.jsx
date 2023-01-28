import React, { useState } from 'react';
import { Table, Space, Modal, Tree } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios'
import { useEffect } from 'react';
import { Fragment } from 'react';
const RoleList = () => {
    const [dataSource, setSource] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roleList, setroleList] = useState([]);
    const [currentRights, setcurrentRights] = useState([])
    const [currentID, setcurrentID] = useState(0)
    const { confirm } = Modal;
    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
            setSource(res.data)
        })
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            setroleList(res.data)
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
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            // 不设置dataIndex的情况下，render中传入的参数item便是当前这一项
            render: (item) => {
                return <Space size="middle">
                    <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => {
                        showModal()
                        setcurrentRights(item.rights)
                        setcurrentID(item.id)
                    }}>编辑</span>
                    <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { confirmMethod(item) }}>删除</span>
                </Space>
            }
        }
    ]
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
        axios.delete(`http://localhost:5000/roles/${item.id}`)



    }

    const showModal = () => {
        setIsModalOpen(true);

    };
    const handleOk = () => {
        setIsModalOpen(false);
        setSource(dataSource.map(item => {
            if (item.id === currentID){
                item.rights=currentRights
            }
            return item
        }))
        axios.patch(`http://localhost:5000/roles/${currentID}`, {
            rights: currentRights
        })

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (checkedKeys) => {
        // console.log(checkedKeys.checked);
        setcurrentRights(checkedKeys.checked)
    };
    return (
        <Fragment>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
            <Modal title="权限列表" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                okText="确认"
                cancelText="取消" >
                <Tree
                    checkable
                    // defaultExpandedKeys={['0-0-0', '0-0-1']}
                    checkedKeys={currentRights}
                    // defaultCheckedKeys={['0-0-0', '0-0-1']}
                    // onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={roleList}
                    checkStrictly={true}
                />
            </Modal>
        </Fragment>

    );
}

export default RoleList;
