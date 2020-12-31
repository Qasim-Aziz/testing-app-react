/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React from 'react'
import { Redirect } from 'react-router-dom'
import { Typography } from 'antd'
import profileImg from './img/profile.jpg'

const { Title } = Typography

const LearnerCard = ({ style, node, name, selectedProgramArea }) => {
    const selectStudent = () => {
        console.log('===> button clicked', node.id)
        localStorage.setItem('studentId', JSON.stringify(node.id))
        window.location.href = '/#/therapistStudent'
    }

    let backgroungColor = 'white'
    if (localStorage.getItem('studentId') && (JSON.parse(localStorage.getItem('studentId')) === node.id)) {
        backgroungColor = '#cccccc'
    }

    return (
        <a onClick={selectStudent}>
            <div
                style={{
                    background: backgroungColor,
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
                    <Title style={{ fontSize: 18, lineHeight: '25px' }}>{name}&apos;s {selectedProgramArea} Program <span style={{position: 'absolute', right: '45px' }}>Build Goals</span></Title>
                    <div>
                        <span
                            style={{
                                color: '#0B35B3',
                                marginRight: 38,
                            }}
                        >
                            Learner
                        </span>
                        <span style={{ color: '#FF5454' }}>{node.category.category}</span>
                        <span style={{position: 'absolute', right: '45px' }}>
                            <a href="/#/target/allocation">
                                <i>Click here to build LTG & STG </i>
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default LearnerCard
