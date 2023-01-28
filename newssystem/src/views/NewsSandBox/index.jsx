import { useRoutes } from 'react-router-dom'
import SlideMenu from '../../components/SlideMenu'
import TopHeader from '../../components/TopHeader'
import getRoutes from '../../routers'
import React, { useState } from 'react';
import { Layout, theme, Spin } from 'antd';
import '../../util/http'
import { useEffect } from 'react';
import axios from 'axios';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { connect } from 'react-redux';
const { Content } = Layout;
function NewsSandBox(props) {
  NProgress.start();
  const [collapsed] = useState(false);
  const [routeList, setrouteList] = useState([]);
  const elements = useRoutes(routeList)

  useEffect(() => {
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    Promise.all([axios.get('http://127.0.0.1:5000/rights'), axios.get('http://127.0.0.1:5000/children')]).then(res => {
      // 动态创建路由表
      setrouteList(getRoutes([...res[0].data, ...res[1].data], rights))

    })
  }, [])
  useEffect(() => {
    NProgress.done()
  })
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <SlideMenu collapsed={collapsed}></SlideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            //当内容部分高度过大时，为内容区域添加滚动条
            overflow: 'auto'
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            {elements}
          </Spin>
        </Content>
      </Layout>
    </Layout>

  )
}
export default connect(state=>({
  isLoading:state.isLoadingReducer.isLoading
}))(NewsSandBox)

