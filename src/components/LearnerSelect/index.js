/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/jsx-closing-bracket-location */

import React from 'react'
import {
    Button,
    Collapse,
    Input,

} from 'antd'

import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const { Panel } = Collapse;

@connect(({ user, student, learnersprogram }) => ({ user, student, learnersprogram }))
class LearnerSelect extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    // componentDidMount() {
    //     const { dispatch } = this.props
    //     dispatch({
    //         type: 'learnersprogram/LOAD_DATA',
    //     })

    //     dispatch({
    //         type: 'student/STUDENT_DETAILS',
    //     })

    //     let std = localStorage.getItem('studentId')
    //     if (std) {
    //         std = JSON.parse(std)
    //         dispatch({
    //             type: 'learnersprogram/SET_STATE',
    //             payload: {
    //                 SelectedLearnerId: std
    //             }
    //         })
    //     }
    //     else {
    //         dispatch({
    //             type: 'student/SET_STATE',
    //             payload: {
    //                 StudentName: '',
    //             },
    //         })
    //     }

    // }

    studentChanged = id => {
        // console.log(id)
        if (id) {
            localStorage.setItem('studentId', JSON.stringify(id))
            const { dispatch, learnersprogram: { Learners } } = this.props
            dispatch({
                type: 'learnersprogram/SET_STATE',
                payload: {
                    SelectedLearnerId: id
                }
            })
            dispatch({
                type: 'student/STUDENT_DETAILS',
            })
        }

    }

    searchLearner = text => {
        const { dispatch, learnersprogram: { CloneLearners } } = this.props

        const searchedLearnersList = []
        if (CloneLearners.length > 0) {
            CloneLearners.map(itemNode => {
                if ((itemNode.node.firstname).toLowerCase().includes((text.toLowerCase()))) {
                    searchedLearnersList.push(itemNode)
                }
            })
        }

        dispatch({
            type: 'learnersprogram/SET_STATE',
            payload: {
                Learners: searchedLearnersList
            }
        })

    }

    render() {
        const {
            learnersprogram: {
                Learners,
            }
        } = this.props

        const pstyle = { marginBottom: 0 }
        
        return (
            <>

                <div style={{ padding: '0px 5px' }}>
                    <Input
                        placeholder="Search learner by name"
                        onChange={e => this.searchLearner(e.target.value)}
                        style={{ marginRight: 16, marginBottom: 5, backgroundColor: '#f9f9f9' }}
                    />
                    <div style={{ overflow: 'auto' }}>
                        <Collapse
                            style={{ backgroundColor: '#f9f9f9' }}
                            onChange={id => this.studentChanged(id)}
                            accordion
                        >
                            {Learners.map(nodeItem => (
                                <Panel
                                    extra={nodeItem.node.category?.category}
                                    showArrow={false}
                                    header={
                                        <>
                                            <FontAwesomeIcon style={{ color: '#777' }} icon={faUser} />{' '}
                                            <Button style={{ padding: 0, height: 22 }} type="link">
                                                {nodeItem.node.firstname} {nodeItem.node.lastname}
                                            </Button>
                                        </>
                                    }
                                    key={nodeItem.node.id}
                                >
                                    <p style={pstyle}>
                                        <span style={{ fontWeight: 700 }}>Email :</span> {nodeItem.node.email}
                                    </p>
                                    <p style={pstyle}>
                                        <span style={{ fontWeight: 700 }}>Phone :</span> {nodeItem.node.mobileno}
                                    </p>
                                    <hr />
                                    <p style={pstyle}>
                                        <span style={{ fontWeight: 700 }}>Case Manager : </span>
                                        {nodeItem.node.caseManager?.name}
                                    </p>
                                    <p style={pstyle}>
                                        <span style={{ fontWeight: 700 }}>CM Email : </span>
                                        {nodeItem.node.caseManager?.email}
                                    </p>
                                    <p style={pstyle}>
                                        <span style={{ fontWeight: 700 }}>CM Phone : </span>
                                        {nodeItem.node.caseManager?.contactNo}
                                    </p>
                                </Panel>
                            ))}
                        </Collapse>
                    </div>
                </div>

            </>
        )
    }
}

export default LearnerSelect
