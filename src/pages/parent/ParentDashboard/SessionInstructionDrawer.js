import React, { Component } from 'react'
import { Button, Typography } from 'antd'
import { UserOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

const { Title, Text } = Typography

class SessionInstruction extends Component {
  renderInsList = () => {
    const propData = this.props
    const itemArray = []
    for (let i = 0; i < propData.session.instruction.edges.length; i += 1) {
      itemArray.push(
        <div className={styles.sessionInsLst} key={i}>
          <div className={styles.inslist}>
            <div className={styles.insIconshell}>
              <div className={styles.insIcon}>
                <p>{i + 1}</p>
              </div>
            </div>
            <div className={styles.insIconText}>
              <p style={{ marginTop: '3px' }}>
                {propData.session.instruction.edges[i].node.instruction}
              </p>
            </div>
          </div>
        </div>,
      )
    }
    return itemArray
  }

  renderSessionHost = () => {
    const propData = this.props
    const targetArray = []
    for (let i = 0; i < propData.session.sessionHost.edges.length; i += 1) {
      targetArray.push(propData.session.sessionHost.edges[i].node.memberName)
    }
    return targetArray.join(',')
  }

  render() {
    const { session } = this.props
    return (
      <>
        <div style={{ padding: '15px' }}>
          <Text style={{ color: '#0B35B3', marginTop: '20px', fontSize: '20px' }}>
            {session.duration}
            <span style={{ marginLeft: '40px', color: 'black' }}>
              {session.targets.edges.length} Target
            </span>
          </Text>

          <div style={{ marginTop: '20px' }}>
            <UserOutlined style={{ color: '#0059b3', fontSize: '22px' }} />
            <Title style={{ marginLeft: '20px', fontSize: '20px', display: 'inline-block' }}>
              Session Host
            </Title>
          </div>
          <div style={{ marginTop: '10px' }}>{this.renderSessionHost()}</div>

          <div style={{ marginTop: '20px' }}>
            <DatabaseOutlined style={{ color: '#0059b3', fontSize: '22px' }} />
            <Title style={{ marginLeft: '20px', fontSize: '20px', display: 'inline-block' }}>
              Item Required
            </Title>
          </div>
          <div style={{ marginTop: '10px' }}>{session.itemRequired}</div>

          <div style={{ marginTop: '20px' }}>
            <FileTextOutlined style={{ color: '#0059b3', fontSize: '22px' }} />
            <Title style={{ marginLeft: '20px', fontSize: '20px', display: 'inline-block' }}>
              Instructions
            </Title>
          </div>

          {this.renderInsList()}

          <div style={{ textAlign: 'center' }}>
            <a href="/#/sessionrecording">
              <Button type="primary" style={{ backgroundColor: '#0059b3' }}>
                Start Session
              </Button>
            </a>
          </div>
        </div>
      </>
    )
  }
}
export default SessionInstruction
