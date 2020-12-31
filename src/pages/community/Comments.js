import React from 'react'
import { Menu, Dropdown, Divider } from 'antd'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import moment from 'moment'
import gp from '../../images/girl.jpg'
import styles from './style.module.scss'

const dropdownMenu = (
  <Menu>
    <Menu.Item>
      <a>Edit Post</a>
    </Menu.Item>
    <Menu.Item>
      <a>Delete Post</a>
    </Menu.Item>
    <Menu.Item>
      <a>Mark as Spam</a>
    </Menu.Item>
  </Menu>
)

class Comments extends React.Component {
  renderMenu = selectedNode => {
    const propData = this.props
    const obj = {
      visible: true,
      node: selectedNode,
    }
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            propData.showCmModal(obj)
          }}
        >
          <p>Leave a comment</p>
        </Menu.Item>
      </Menu>
    )
  }

  renderComments = () => {
    const propData = this.props
    const commentArray = []
    console.log(propData)
    if (propData.blogs.edges.length > 0) {
      for (let i = 0; i < propData.blogs.edges.length; i += 1) {
        commentArray.push(
          <>
            <Divider />
            <div className={styles.commentBox}>
              <div className={styles.commentImageBox}>
                <img src={gp} alt="not_found" />
              </div>
              <div className={styles.commentDesc}>
                <div className={styles.cmhd} style={{ display: 'flex' }}>
                  <h4 style={{ fontWeight: 'bold' }}>
                    {propData.blogs.edges[i].node.user.username}
                  </h4>
                  <p style={{ marginLeft: '2%', color: 'black' }}>posted</p>
                </div>
                <div style={{ color: 'black' }} className={styles.cmTime}>
                  <p> {moment(propData.blogs.edges[i].node.time).format('h:mm:ss a')} </p>
                </div>
                <div className={styles.cmDesc}>
                  <p>{propData.blogs.edges[i].node.comment}</p>
                </div>
                <div className={styles.cmSubAct} style={{ color: '#4b7cf3' }}>
                  <div style={{ display: 'flex', width: '20%' }} className={styles.cmsublike}>
                    <HeartOutlined style={{ fontSize: '20px' }} />
                    <p style={{ marginLeft: '2%' }}>61 Likes</p>
                  </div>
                  <div
                    style={{ display: 'flex', marginLeft: '4%', width: '50%' }}
                    className={styles.cmsubCmnt}
                  >
                    <CommentOutlined style={{ fontSize: '20px' }} />
                    <p style={{ marginLeft: '2%' }}>61 Comments</p>
                  </div>
                </div>
              </div>
              <div className={styles.cmdrpDn}>
                <Dropdown overlay={dropdownMenu} placement="bottomRight">
                  <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                    Actions
                  </a>
                </Dropdown>
              </div>
            </div>
          </>,
        )
      }
      return commentArray
    }
    return null
  }

  render() {
    const propData = this.props
    return (
      <>
        <div className={styles.commentBoxCover}>
          <div className={styles.cmdrpDnBlg}>
            <Dropdown overlay={this.renderMenu(propData.node)} placement="bottomRight">
              <a style={{ fontWeight: 'bold', fontSize: '15px' }}>Actions</a>
            </Dropdown>
          </div>
          {this.renderComments()}
        </div>
      </>
    )
  }
}

export default Comments
