/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Row, Col, Typography, Button, notification } from 'antd'
import safeGardIcon from '../../icons/safeGard.png'

const { Text, Paragraph } = Typography

const Acceptence = ({ style = '' }) => {

    const commitmentsRedirect = () => {
        notification.warning({
            message: 'Acceptance & Commitment',
            description: 'Under Development',
        })
    }

    return (
        <a onClick={commitmentsRedirect}>
            <div
                style={{
                    margin: '10px 10px 10px 0',
                    padding: '22px 31px',
                    height: '180px',
                    background: '#FFFFFF',
                    border: '1px solid #E4E9F0',
                    boxSizing: 'border-box',
                    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                    borderRadius: 10,
                    maxWidth: 400,
                    ...style,
                }}
            >

                <Row type="flex" justify="space-between" style={{ color: '#000' }}>
                    <Col span={20}>
                        <Text style={{ fontSize: '20px', lineHeight: '27px', color: '#000' }}>Acceptance & Commitment</Text>
                    </Col>
                    <Col span={4}>
                        <img style={{ width: 60, height: 60 }} src={safeGardIcon} alt="" />
                    </Col>
                </Row>
                <Paragraph style={{ fontSize: '14px', color: '#000' }}>
                    A united community that promotes open and dedicated embracing of all aspects of life.
                </Paragraph>

            </div>
        </a>
    )
}

export default Acceptence
