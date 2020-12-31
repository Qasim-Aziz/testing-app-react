/* eslint-disable consistent-return */
import React from 'react'
import classNames from 'classnames'
import styles from './style.module.scss'

const Loader = ({error, spinning = true, fullScreen }) => {
  if(error){
    console.log(error)
  }
  else{
    return (
      <div
        className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
      />
    )
  }
  
}

export default Loader
