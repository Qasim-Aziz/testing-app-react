/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
import React, { Component } from 'react'
import { Button, Progress, Drawer, Card, Layout, Row, Col, Typography, Switch, Icon, notification } from 'antd'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'
import SessionInstruction from './SessionInstructions'
import SessionCardForProgram from '../parent/ParentDashboard/SessionCardForProgram'

const { Content } = Layout
const { Title, Text } = Typography

const customDivStyle = {
    // marginLeft: '20px',
    background: '#F9F9F9',
    borderRadius: 10,
    minHeight: '700px',
    padding: '28px 27px 20px',
}

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            visible: false,
            sessionName: '',
        }
        this.onClose = this.onClose.bind(this)
    }

    componentDidMount() {
        const studentId = JSON.parse(localStorage.getItem('studentId'))
        apolloClient.query({
            query: gql`{
                GetStudentSession(studentId: "${studentId}") {
                    edges {
                        node {
                            id
                            itemRequired
                            duration
                            sessionName {
                                id
                                name
                            }
                            instruction {
                                edges {
                                    node {
                                        id
                                        instruction
                                    }
                                }
                            }
                            sessionHost {
                                edges {
                                    node {
                                        id
                                        memberName
                                        timeSpent {
                                            edges {
                                                node {
                                                    id
                                                    sessionName {
                                                        id
                                                        name
                                                    }
                                                    duration
                                                }
                                            }
                                        }
                                        relationship {
                                            id
                                            name
                                        }
                                    }
                                }
                            }
                            targets {
                                edges {
                                    node {
                                        id
                                        time
                                        targetInstr
                                        date
                                        targetAllcatedDetails {
                                            id
                                            targetName
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`,
            fetchPolicy: 'network-only'
        })
            .then(result => {
                this.setState({
                    sessions: result.data.GetStudentSession.edges,
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    renderSessionCards = () => {
        const stateData = this.state
        const array = []
        if (stateData.sessions !== undefined) {
            for (let i = 0; i < stateData.sessions.length; i += 1) {
                if (stateData.sessions[i].node.targets.edges.length > 0) {
                    array.push(
                        <SessionCardForProgram
                            id={stateData.sessions[i].node.id}
                            sessionName={stateData.sessions[i].node.sessionName.name}
                            duration={stateData.sessions[i].node.duration}
                            hostList={stateData.sessions[i].node.sessionHost.edges}
                            session={stateData.sessions[i].node}
                        />,
                    )
                }
            }
        }
        return array
    }

    openSubDrawer = node => {
        const { dispatch } = this.props

        dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
                SessionId: node.id,
            },
        })

        this.setState({
            // isSubdrawerOper: true,
            sessionName: node.sessionName.name,
            visible: true,
        })
    }

    onClose = () => {
        this.setState({
            visible: false,
            // isSubdrawerOper: false,
        })
    }

    getFilteredArray = () => {
        const stateData = this.state
        for (let i = 0; i < stateData.sessions.length; i += 1) {
            if (stateData.sessions[i].node.sessionName.name === stateData.sessionName) {
                return stateData.sessions[i].node
            }
        }
        return {}
    }

    render() {
        const stateData = this.state
        const filteredArray = this.getFilteredArray()

        return (
            <>
                {this.renderSessionCards()}
                <Drawer
                    placement="right"
                    closable={false}
                    maskStyle={{ display: 'flex' }}
                    visible={stateData.visible}
                    width={500}
                >
                    <SessionInstruction
                        session={filteredArray}
                        closeModal={() => {
                            this.onClose()
                        }}
                    />
                </Drawer>

            </>
        )
    }
}
export default StudentDrawer
