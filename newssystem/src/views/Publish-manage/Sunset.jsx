import React from 'react'
import NewsPublish from '../../components/PublishManage/NewsPublish';
import usePublish from '../../components/PublishManage/usePublish';
export default function Sunset() {
  const {dataSource,handleDelete}=usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} method={handleDelete}/>
    </div>
  )
}
