import React from 'react'
import { Menu, Dropdown } from 'antd'
import HiddenBox from './HiddenBox'
import styles from './style.module.scss'

export default class CommentLike extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonClicked: false,
    }
    this.showCmModal = this.showCmModal.bind(this)
  }

  showCmModal = data => {
    const propData = this.props
    propData.showCmModal(data)
  }

  handleClick = () => {
    this.setState(prevState => ({
      buttonClicked: !prevState.buttonClicked,
    }))
  }

  render() {
    const propData = this.props
    const stateData = this.state
    return (
      <>
        <div
          className={styles.commentComp}
          onClick={() => {
            this.handleClick()
          }}
          role="presentation"
        >
          {propData.children}
        </div>
        <div className={styles.clickHandlerDiv}>
          {stateData.buttonClicked && (
            <HiddenBox
              comments={propData.blogs}
              node={propData.node}
              showModal={data => {
                this.showCmModal(data)
              }}
            />
          )}
        </div>
      </>
    )
  }
}
