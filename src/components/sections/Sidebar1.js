import React, { Component } from 'react'
import { List, Avatar } from 'antd'
import './Sidebar1.scss'
import mandData from '../../icons/mandData.PNG'

class Sidebar1 extends Component {
  render() {
    const { data, header } = this.props
    return (
      <div>
        <List
          style={{ borderBottom: 'none', padding: '20px' }}
          header={<div style={{ fontSize: '18px' }}>{header}</div>}
          dataSource={data}
          renderItem={item => (
            <List.Item className="listItem">
              <Avatar src={mandData} style={{ opacity: '0.4' }} />
              {''}&nbsp;&nbsp;
              {item}
            </List.Item>
          )}
        />
      </div>
    )
  }
}

export default Sidebar1
