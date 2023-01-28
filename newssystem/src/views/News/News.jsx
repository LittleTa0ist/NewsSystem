import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader } from '@ant-design/pro-layout';
import { Card, Col, Row, List } from 'antd';
import { NavLink } from 'react-router-dom';
import _ from 'lodash'
export default function News() {
    const [newsList, setnewsList] = useState([]);
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            // entries方法将对象转换为二维数组
            setnewsList(Object.entries(_.groupBy(res.data, item => item.category.title)))
            // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    }, []);
    return (
        <div style={{ width: '95%', margin: '0 auto' }}>
            <PageHeader
                // className='site-page-header'
                title="撰写新闻"
                subTitle='查看新闻'
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {newsList.map(item => {
                        return (
                            <Col span={8} key={item[0]} >
                                <Card title={item[0]} bordered={true} hoverable={true} style={{height:'100%'}}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={(data) => <List.Item>
                                            <NavLink to={`/detail/${data.id}`}>{data.title}</NavLink>
                                        </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    })}


                </Row>
            </div>
        </div>

    )
}
