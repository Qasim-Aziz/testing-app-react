/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Row, Col, Typography, Button, notification } from 'antd'
import doctorIcon from '../../icons/doctor.png'

const { Text, Paragraph } = Typography

const Doctors = ({ title, icon, style }) => {

    const doctorsRedirect = () => {
        // notification.warning({
        //     message: 'Verifyed Doctors',
        //     description: 'Under Development',
        // })
        window.location.href = '/#/doctor'
    }

    return (
        <a onClick={doctorsRedirect}>
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
                        <Text style={{ fontSize: '20px', lineHeight: '27px', color: '#000' }}>Verified Doctors</Text>
                    </Col>
                    <Col span={4}>
                        <img style={{ width: 60, height: 60 }} src={doctorIcon} alt="" />
                    </Col>
                </Row>
                <Paragraph style={{ fontSize: '14px', color: '#000' }}>
                    A holistic team of specialized, verified and experienced doctors.
                </Paragraph>

            </div>
        </a>
    )
}

export default Doctors
