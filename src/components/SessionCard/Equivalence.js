/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from 'react'
import { PlusOutlined, CopyOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import styles from './style.module.scss'
import { arrayNotNull, notNull, capitalize } from '../../utilities'

const { Title, Text } = Typography

const EquivalenceCard = ({
    targetItem = '',
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
               {targetItem.code} : {capitalize(targetItem.target.targetMain.targetName)}
            </Title>

            <Button className={styles.addSessionBtn} onClick={allocateSessionToTarget}>
                {allocated ? <CopyOutlined /> : <PlusOutlined />}
            </Button>
        </div>
    )
}

export default EquivalenceCard
