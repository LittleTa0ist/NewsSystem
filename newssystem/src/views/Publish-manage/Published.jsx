import React from 'react'
import NewsPublish from '../../components/PublishManage/NewsPublish';
import usePublish from '../../components/PublishManage/usePublish';
export default function Published() {
  const {dataSource,handleSunset}=usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource} method={handleSunset}/>
    </div>
  )
}
