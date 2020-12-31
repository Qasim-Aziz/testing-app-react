import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Spinner = () => (
  <Spin
    tip="Loading..."
    indicator={<LoadingOutlined />}
    style={{ margin: '4rem auto', textAlign: 'center', width: '100%' }}
  />
)

export default Spinner
