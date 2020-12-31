import React from 'react'
import { Menu, Dropdown } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import styles from '../style.module.scss'

class Learners extends React.Component {
  render() {
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <Link to="/partners/learner">
            <i className={`${styles.menuIcon} icmn-plus`} /> Add new learner
          </Link>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item>
          <Link to="/partners/viewlearners">
            <i className={`${styles.menuIcon} icmn-paragraph-left`} /> View all learners
          </Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
        <div className={styles.dropdown}>
          <i className={`${styles.icon} icmn-file-openoffice`} />
          <span className="d-none d-xl-inline">
            <strong>
              <FormattedMessage id="Learners" />
            </strong>
          </span>
        </div>
      </Dropdown>
    )
  }
}

export default Learners
