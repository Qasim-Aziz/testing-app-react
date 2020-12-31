import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import styles from './style.module.scss'

const RightDrawer = ({ show, onClose, heading, children }) => {
  return (
    <div>
      <div className={show ? `${styles.drawerBackground}` : ''} />
      <div className={show ? `${styles.drawer} ${styles.drawerOpened}` : styles.drawer}>
        <Scrollbars>
          <div className={styles.container}>
            <div className={styles.title}>
              {heading}
              <button className={`${styles.close} fa fa-times`} onClick={onClose} type="button" />
            </div>
          </div>
          {children}
        </Scrollbars>
      </div>
    </div>
  )
}

export default RightDrawer
