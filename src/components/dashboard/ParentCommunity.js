/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from 'react'
import { Row, Col, Typography, Button } from 'antd'
import parentCildIcon from '../../icons/parentChild.png'

const { Text, Paragraph } = Typography

const ParentCommunity = ({ style }) => {

    const parentCommunityRedirect = () => {
        // notification.warning({
        //   message: 'Parent Community',
        //   description: 'Under Development',
        // })
        window.location.href = '/#/parent/community'
    }

    return (
        <a href="/#/parent/community">
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
                        <Text style={{ fontSize: '20px', lineHeight: '27px', color: '#000' }}>Parent  Community</Text>
                    </Col>
                    <Col span={4}>
                        <img style={{ width: 60, height: 60 }} src={parentCildIcon} alt="" />
                    </Col>
                </Row>
                <Paragraph style={{ fontSize: '14px', color: '#000' }}>
                    Engagement of parents deepens the understanding and learning process and hence leads to a fruitful journey for a better life.
                </Paragraph>

            </div>
        </a>
    )
}

export default ParentCommunity
