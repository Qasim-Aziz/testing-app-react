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

const { Title } = Typography

const LearnerDetailsCard = ({ style, node }) => {

    return (
        <div
            style={{
                background: '#FFFFFF',
                border: '1px solid #E4E9F0',
                boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                borderRadius: 10,
                padding: '16px 12px',
                display: 'flex',
                alignItems: 'center',
                ...style,
            }}
        >
            <img
                src={profileImg}
                alt=""
                style={{
                    width: 80,
                    height: 64,
                    borderRadius: 10,
                }}
            />
            <div
                style={{
                    marginLeft: 22,
                }}
            >
                <Title style={{ fontSize: 18, lineHeight: '25px' }}>
                    {node.firstname} ({node.category && node.category.category})
                    <span style={{marginLeft: 38, fontSize: '14px', fontWeight: '1px', color: '#222'}}>
                        Email : {node.email && node.email}
                    </span>
                    <span style={{marginLeft: 38, fontSize: '14px', fontWeight: '1px', color: '#222'}}>
                        Phone : {node.mobileno && node.mobileno}
                    </span>
                </Title>
                <div>
                    {/* <span
                        style={{
                            color: '#0B35B3',
                            marginRight: 38,
                        }}
                    >
                        Learner
                        </span>
                    <span style={{ color: '#FF5454', marginRight: 38 }}>{node.category && node.category.category}</span> */}
                    
                </div>
                <div>
                    <span
                        style={{
                            color: '#0B35B3',
                            marginRight: 38,
                        }}
                    >
                        Case Manager
                        </span>
                    <span style={{ color: '#FF5454', marginRight: 38 }}>{node.caseManager?.name}</span>
                    <span style={{marginRight: 38}}>
                        Email : {node.caseManager?.email}
                    </span>
                    <span style={{marginRight: 38}}>
                        Phone : {node.caseManager?.contactNo}
                    </span>
                </div>
                
            </div>
        </div>
    )
}

export default LearnerDetailsCard
