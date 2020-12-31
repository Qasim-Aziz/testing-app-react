import React, { Component } from 'react'
import { TeamOutlined } from '@ant-design/icons'
import { Badge } from 'antd'

export default class componentName extends Component {
  render() {
    const { color, title } = this.props
    return (
      <>
        <div
          style={{
            marginLeft: '10px',
            marginBottom: '5px',
            borderBottom: `4px solid ${color}`,
            borderRadius: 2,
            padding: 10,
          }}
        >
          <Badge color={color} />
          <TeamOutlined style={{ fontSize: '15px' }} />
          &nbsp; <span style={{ fontWeight: 'bold', fontSize: 15 }}>{title}</span>
          {/* <div
            style={{
              backgroundColor: `${color}`,
              height: '2px',
              width: '10%',
              border: `2px solid ${color}`,
              borderRadius: 5,
            }}
          /> */}
        </div>
      </>
    )
  }
}
