import React from 'react'
import NewsPublish from '../../components/PublishManage/NewsPublish';
import usePublish from '../../components/PublishManage/usePublish';
export default function Unpublished() {
  const {dataSource,handlePublish}=usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} method={handlePublish}/>
    </div>
  )
}
