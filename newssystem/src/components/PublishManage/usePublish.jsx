import axios from 'axios';
import { notification,Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react'
export default function usePublish(publishState) {
    const { username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([]);
    const { confirm } = Modal;
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/news?author=${username}&publishState=${publishState}&_expand=category`).then(res => {
            setdataSource(res.data)
        })

    }, [username, publishState]);
    const handlePublish = (item) => {
        notification.open({
            message: `通知`,
            description:
                `您可以到【发布管理/已发布】中查看您的新闻`,
            placement: 'bottomRight',
        })
        setdataSource(dataSource.filter(data => item.id !== data.id))
        axios.patch(`http://127.0.0.1:5000/news/${item.id}`, {
            publishState: 2
        })
    }
    const handleSunset = (item) => {
        notification.open({
            message: `通知`,
            description:
                `您可以到【发布管理/已下线】中查看您的新闻`,
            placement: 'bottomRight',
        })
        setdataSource(dataSource.filter(data => item.id !== data.id))
        axios.patch(`http://127.0.0.1:5000/news/${item.id}`, {
            publishState: 3
        })
    }
    const confirmDelete= (item) => {

        setdataSource(dataSource.filter(data => item.id !== data.id))
        axios.delete(`http://127.0.0.1:5000/news/${item.id}`).then(() => {
            notification.open({
                message: `通知`,
                description:
                    `删除成功`,
                placement: 'bottomRight',
            })
        })
    }
    const handleDelete= (item) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleFilled />,
            content: '确定要删除吗？',
            okText: '是的',
            okType: 'danger',
            cancelText: '取消',
            onOk() {

                confirmDelete(item)


            },
            onCancel() {

            },
        });
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}