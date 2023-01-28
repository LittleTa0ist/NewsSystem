import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@ant-design/pro-layout';
import { Steps, Button, message, Form, Select, Input, notification } from 'antd';
import NewsEditor from '../../components/NewsManage/NewsEditor';
import style from './AddNews.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const AddNews = () => {
    const [form] = Form.useForm();
    // const [api] = notification.useNotification();
    const [current, setCurrent] = useState(0);
    const [category, setCategory] = useState([]);
    const [content, setContent] = useState('');
    const [formInfo, setformInfo] = useState({});
    const navigate = useNavigate()
    const formRef = useRef()
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/categories').then(res => {
            setCategory(res.data)
        })
    }, []);
    const next = () => {
        if (current === 0) {
            formRef.current.validateFields().then(res => {
                setformInfo(res)
                setCurrent(current + 1);
            }).catch(err => {
                message.error('请填写完整')
            })
        } else {
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空')
            } else {
                console.log(formInfo, content);
                setCurrent(current + 1);
            }

        }

    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const handleSave = (auditState) => {
        const User = JSON.parse(localStorage.getItem('token'))
        axios.post('http://127.0.0.1:5000/news', {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : '全球',
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.open({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement:'bottomRight',
            })
        })
    }
    return (
        <div>
            <PageHeader
                // className='site-page-header'
                title="撰写新闻"
            />
            <Steps
                style={{ marginTop: '24px' }}
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题，新闻分类',
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主体内容',

                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                    },
                ]}
            />
            <div className={current === 0 ? style.container : style.hidden}>
                <Form

                    ref={formRef}
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item
                        name="title"
                        label="新闻标题"
                        rules={[
                            {
                                required: true,
                                message: '请输入新闻标题！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="categoryId"
                        label="新闻类型"
                        rules={[
                            {
                                required: true,
                                message: '请选择新闻类型！',
                            }
                        ]}
                    >
                        <Select
                            options={category.map(item => {
                                return {
                                    value: item.id,
                                    label: item.title,
                                }
                            })}
                        />
                    </Form.Item>
                </Form>
            </div>
            <div className={current === 1 ? style.container : style.hidden}>
                <NewsEditor getContent={(content) => {
                    setContent(content)
                }} />
            </div>
            <div className={current === 2 ? style.container : style.hidden}>
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < 2 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === 2 && (
                    <>
                        <Button style={{
                            margin: '0 8px',
                        }} type="primary" onClick={() => handleSave(0)}>
                            保存草稿箱
                        </Button>
                        <Button style={{
                            margin: '0 8px',
                        }} danger onClick={() => handleSave(1)}>
                            提交审核
                        </Button>
                    </>

                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        上一步
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AddNews;
