import React, { Component } from 'react'
import { Button } from 'antd'
import { UserOutlined, DatabaseOutlined, FileTextOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

class SessionInstruction extends Component {
  renderInsDuration = () => {
    const propData = this.props
    return (
      <div className={styles.sesDuration}>
        <div className={styles.sestime}>
          <p>{propData.session.duration}</p>
        </div>
        <div className={styles.sesTarget}>
          <p>{propData.session.targets.edges.length} Target</p>
        </div>
        {/* change here for trials */}
        <div className={styles.sesTrial}>
          <p>{propData.session.targets.edges.length} Trials</p>
        </div>
      </div>
    )
  }

  renderItemRequired = () => {
    const propData = this.props
    return (
      <div className={styles.sesItemReq}>
        <div className={styles.sessionHostHeader}>
          <div className={styles.sessionHostHeaderIcon}>
            <DatabaseOutlined style={{ color: 'darkorange', fontSize: '22px' }} />
          </div>
          <div className={styles.sessionHostHeaderText}>
            <p>Item Required</p>
          </div>
        </div>
        <div className={styles.sessionHostText}>{propData.session.itemRequired}</div>
      </div>
    )
  }

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
              <p>{propData.session.instruction.edges[i].node.instruction}</p>
            </div>
          </div>
        </div>,
      )
    }
    return itemArray
  }

  renderInstruction = () => {
    return (
      <div className={styles.sesIns}>
        <div className={styles.sessionHostHeader}>
          <div className={styles.sessionHostHeaderIcon}>
            <FileTextOutlined style={{ color: 'darkorange', fontSize: '22px' }} />
          </div>
          <div className={styles.sessionHostHeaderText}>
            <p>Instructions</p>
          </div>
        </div>
        <div className={styles.sessionHostText}>
          This is a short brief about the assessment & why it matters.
        </div>
        {this.renderInsList()}
      </div>
    )
  }

  renderSessionHost = () => {
    const propData = this.props
    const targetArray = []
    for (let i = 0; i < propData.session.sessionHost.edges.length; i += 1) {
      targetArray.push(propData.session.sessionHost.edges[i].node.memberName)
    }
    return targetArray.join(',')
  }

  close = () => {
    const propData = this.props
    propData.closeModal()
  }

  render() {
    return (
      <>
        <div className={styles.subsesshell}>
          <div
            className={styles.cancelStudentInsButton}
            role="presentation"
            onClick={() => {
              this.close()
            }}
          >
            <CloseOutlined style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} />
          </div>
          <div className={styles.subSesHeading}>
            <p>Session Preview</p>
          </div>
          <div className={styles.sesimgDes}>
            <p>Kunal selects an item that doesn&apos;t share the same features</p>
          </div>
          {this.renderInsDuration()}
          <div className={styles.sesHosts}>
            <div className={styles.sessionHostHeader}>
              <div className={styles.sessionHostHeaderIcon}>
                <UserOutlined style={{ color: 'darkorange', fontSize: '22px' }} />
              </div>
              <div className={styles.sessionHostHeaderText}>
                <p>Session Host</p>
              </div>
            </div>
            <div className={styles.sessionHostText}>{this.renderSessionHost()}</div>
          </div>
          {this.renderItemRequired()}
          {this.renderInstruction()}
          <div className={styles.sesInsbtn}>
            <a href="/#/sessionrecording">
              <Button type="primary" className={styles.sessionInsButton}>
                Start New Session
              </Button>
            </a>
          </div>
        </div>
      </>
    )
  }
}
export default SessionInstruction
