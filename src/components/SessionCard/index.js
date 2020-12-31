import React from 'react'
import { PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import styles from './style.module.scss'
import { arrayNotNull, notNull, capitalize } from '../../utilities'
import motherSon from '../../pages/targets/motherSon.jpg'

const { Title, Text } = Typography

const SessionCard = ({
  image = { motherSon },
  heading = '',
  receptiveLanguage = '',
  allocateSessionToTarget,
  allocated
}) => {
  return (
    <div className={allocated ? styles.sessionCardAllocated : styles.sessionCard}>
      <Title
        style={{
          color: '#000',
          fontSize: 14,
          lineHeight: '25px',
          display: 'inline',
          margin: 0,
          fontWeight: '500',
        }}
      >
        {capitalize(heading)}
      </Title>
      
      <Button className={styles.addSessionBtn} onClick={allocateSessionToTarget}>
        {allocated ? <CopyOutlined /> : <PlusOutlined />}
      </Button>
    </div>
  )
}

export default SessionCard
