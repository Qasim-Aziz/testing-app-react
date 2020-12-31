/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-shadow */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Typography } from 'antd'
import profileImg from './img/profile.jpg'

const { Title, Text } = Typography

const DataRecordingCards =  () => {

    const cardStyle = {
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '16px 12px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    }

    return (
        <div
            style={{
                marginLeft: '20px',
                background: '#F9F9F9',
                borderRadius: 10,
                padding: '28px 27px 20px',
            }}
        >
            <Title 
                style={{ 
                    fontSize: 20,
                    lineHeight: '27px', 
                }}
            >
                Data Recordings
            </Title>
            <a href="/#/targetsAllocationToSession/">
                <div style={cardStyle}>
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Target Allocation to Session</Text>
                </div>
            </a>
            <a href="/#/sessionDetails">
                <div style={cardStyle}>
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Learner Sessions</Text>
                </div>
            </a>
            <a href="/#/appointmentData/">
                <div style={cardStyle}>
                    <Text style={{ fontSize: 20, lineHeight: '27px', }}>Appointment</Text>
                </div>
            </a>
        </div>
    )
}

export default DataRecordingCards
