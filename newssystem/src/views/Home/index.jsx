import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Space, Drawer } from 'antd';
import 'antd/dist/reset.css';
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts'
import _ from 'lodash'
import { Avatar } from 'antd';
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const [open, setOpen] = useState(false);
  const barRef = useRef()
  const pieRef = useRef()
  const { username, role: { roleName }, region } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
      setviewList(res.data)
    })
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
      setstarList(res.data)
    })
  }, [])
  useEffect(() => {

    axios.get('/news?publishState=2&_expand=category').then(res => {
      initEchart(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })

    return () => {
      window.onresize = null
    }
  }, [])
  const initEchart = (obj) => {
    var myChart = echarts.init(barRef.current)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      myChart.resize()
    }
  }
  const initPie = (obj) => {
    var myChart = echarts.init(pieRef.current);
    var option;

    let currentList = allList.filter(item => item.author === username)
    let groupObj = _.groupBy(currentList, item => item.category.title)
    let data = []
    for (let i in groupObj) {
      data.push({
        name: i,
        value: groupObj[i].length
      })
    }
    option = {
      title: {
        text: '类型分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: `${username}的新闻分类`,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
    option && myChart.setOption(option);
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true} style={{ height: '100%' }}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item>
                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true} style={{ height: '100%' }}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ height: '100%' }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                let p = new Promise((resolve, reject) => {
                  setOpen(true)
                  resolve(123)

                })
                p.then(res => initPie())
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={username}
              description={
                <Space size="middle">
                  <b>{region ? region : '全球'}</b>

                  {roleName}
                </Space >
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ width: '100%', height: '400px', marginTop: '50px' }}></div>
      <Drawer
        title={`${username}的新闻分类`}
        placement='right'
        closable={false}
        onClose={() => { setOpen(false) }}
        open={open}
        size='large'
      >
        <div ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '50px' }}></div>
      </Drawer>
    </div>
  )
}


