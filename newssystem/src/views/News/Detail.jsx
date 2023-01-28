import React, { useEffect, useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout';
import { HeartTwoTone } from '@ant-design/icons';
import { Descriptions, Space } from 'antd';
import moment from 'moment'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
export default function Detail() {
    const [newsInfo, setNewsInfo] = useState(null)
    const navigate = useNavigate()
    let { id } = useParams()
    useEffect(() => {
        //console.log(props.match.params.id);
        //props.match.params可以获取url中的参数
        axios.get(`http://localhost:5000/news/${id}?_expand=category&_expand=role`)
            .then((res) => {
                //console.log(res.data);
                setNewsInfo({
                    ...res.data,
                    view: res.data.view + 1
                })
                return res.data
            }).then(res => {
                axios.patch(`/news/${id}`, {
                    view: res.view + 1
                })
            })
    }, [id])
    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div>
            {/* 避免组件加载完后，数据还没出来 */}
            {newsInfo &&
                <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => navigate(-1)}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                <Space>
                                    {newsInfo.category.title}
                                    <HeartTwoTone twoToneColor="#eb2f96" style={{ cursor: 'pointer' }} onClick={handleStar} />
                                </Space>

                            </div>
                        }>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: "green" }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: "green" }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量"><span style={{ color: "green" }}>0</span></Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {/* 让带标签的内容自动转换 */}
                    <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: "20px 24px", border: "1px solid #ccc", padding: '20px', borderRadius: '5px' }}>
                    </div>
                </div>}
        </div>
    )
}