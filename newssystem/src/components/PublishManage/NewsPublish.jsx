import React from 'react'
import { Table, Space,  Button } from 'antd'
import { NavLink } from 'react-router-dom'
export default function NewsPublish(props) {
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
                    {item.publishState === 1 && <Button type='primary' onClick={() => {props.method(item)}}>发布</Button>}
                    {item.publishState === 2 && <Button danger onClick={() => {props.method(item)}}>下线</Button>}
                    {item.publishState === 3 && <Button danger onClick={() => {props.method(item)}} >删除</Button>}
                    {/* <span style={{ color: 'red', cursor: !item.default ? 'pointer' : 'not-allowed' }} onClick={() => { confirmMethod(item) }}>删除</span> */}
                </Space >
            }
        },]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 6 }} rowKey={item => item.id} />
        </div>
    )
}
