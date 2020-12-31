/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-else-return */
import React, { Component } from 'react'
import { Button, Progress, Drawer, Card, Layout, Row, Col, Typography, Switch, Icon, notification } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import apolloClient from '../../apollo/config'

const { Content } = Layout
const { Title, Text } = Typography

const assessmentCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E4E9F0',
    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
    borderRadius: 10,
    width: '100%',
    marginRight: '20px',
    padding: '12px 12px',
    alignItems: 'center',
    display: 'inline-block',
    marginTop: '20px'
}
const parentCardStyle = {
    // background: '#F9F9F9',
    borderRadius: 10,
    padding: '20px',
    margin: '0 10px',
    height: 600,
    overflow: 'auto'
}
const cardStyle = {
    background: '#F9F9F9',
    height: 500,
    overflow: 'auto',
}
const targetMappingStyle = {
    background: '#FFFFFF',
    border: '1px solid #E4E9F0',
    boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
    borderRadius: 10,
    padding: '16px 12px',
    // display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
}

@connect(({ user, learnersprogram, student }) => ({ user, learnersprogram, student }))
class StudentDrawer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            studentProgramAreas: [],
            showBuildGoalsCard: false,
            selectedArea: ''
        }
    }

    componentDidMount() {
        // const propData = this.props
        const std = JSON.parse(localStorage.getItem('studentId'))
        apolloClient.query({
            query: gql`{
                student(id: "${std}"){
                    id
                    firstname
                    lastname
                    programArea {
                        edges {
                            node {
                                id,
                                name,
                                description
                                percentageLong
                            }
                        }
                    }
                }
            }`,
        })
            .then(result => {
                this.setState({
                    studentProgramAreas: result.data.student.programArea.edges
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    validateArea = id => {
        const { studentProgramAreas } = this.state
        let checked = false

        studentProgramAreas.map(nodeItem => {
            if (nodeItem.node.id === id) checked = true
        })

        return checked
    }

    generateNotification = (text) => {
        notification.warning({
            message: 'Warning',
            description: text,
        })
    }

    // when user select program area card
    showDrawr = node => {
        // console.log('===> selected program area : ', node )
        // setting student selected program area to store
        const { dispatch } = this.props
        dispatch({
            type: 'student/SET_STATE',
            payload: {
                ProgramAreaId: node.id,
            },
        })

        this.setState({
            showBuildGoalsCard: true,
            selectedArea: node.name,
        })

        window.location.href = '/#/target/allocation'
    }

    selectProgramArea = node => {
        const checked = this.validateArea(node.node.id)

        if (checked) {
            this.showDrawr(node.node)
        }
        else {
            this.generateNotification('This program area is not activated')
        }
    }

    activeInactiveProgram = (isActive, areaId) => {
        const std = JSON.parse(localStorage.getItem('studentId'))
        const { studentProgramAreas } = this.state
        const areasIds = []
        if (isActive) {
            studentProgramAreas.map(item => {
                areasIds.push(item.node.id)
            })
            areasIds.push(areaId)
        }
        else {
            studentProgramAreas.map(item => {
                if (item.node.id !== areaId) areasIds.push(item.node.id)
            })
        }


        apolloClient.mutate({
            mutation: gql`mutation UpdateStudentProgramAreas(
                $id: ID!
                $areaList: [ID]
            ) {
                updateStudent(
                    input: {
                        studentData: {
                            id: $id
                            programArea: $areaList
                        }
                    }
                ) 
                {
                    student {
                        id
                        firstname
                        programArea {
                            edges {
                                node {
                                    id,
                                    name,
                                    description
                                    percentageLong
                                }
                            }
                        }
                    }
                }
            }`,
            variables: {
                id: std,
                areaList: areasIds
            }
        })
            .then(result => {
                if (isActive) {
                    notification.success({
                        message: 'Success',
                        description: 'Program Area Activated Successfully',
                    })
                } else {
                    notification.success({
                        message: 'Success',
                        description: 'Program Area Deactivated Successfully',
                    })
                }

                this.setState({
                    studentProgramAreas: result.data.updateStudent.student.programArea.edges
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    getPercentageByProgramArea = (programId) => {

        let TotalTarget = 0
        let MasterTarget = 0

        apolloClient.query({
            query: gql`query TherapyPrograms($student: ID!, $program: ID!) {
                programDetails(id: $program) {
                    id
                    name
                    description
                    longtermgoalSet(student: $student) {
                        edges {
                            node {
                                id
                                percentageCorr
                                masterTar
                                totalTar
                                goalName
                                shorttermgoalSet {
                                    edges {
                                        node {
                                            id
                                            goalName
                                            percentageCorr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }`,
            variables: {
                student: localStorage.getItem('studentId'),
                program: programId
            }
        })
            .then(result => {
                // console.log(result)

                result.data.programDetails.longtermgoalSet.edges.map((longNode, longIndex) => {
                    TotalTarget += longNode.node.totalTar
                    MasterTarget += longNode.node.masterTar
                })

            })
            .catch(error => {
                console.log(error)
            })

        if (TotalTarget === 0 || MasterTarget === 0) return 0
        else return (MasterTarget / TotalTarget) * 100
    }





    render() {
        const { showBuildGoalsCard, selectedArea } = this.state
        const {
            student: { StudentName },
            learnersprogram: { ProgramAreas }
        } = this.props

        const tdStyle = { border: '1px solid #dddddd', padding: 8, textAlign: 'center' }

        return (
            <>



                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    {ProgramAreas.map((nodeItem, index) => (

                        <tr>
                            <td style={{ ...tdStyle, width: 250 }}><Button type="link" onClick={() => this.selectProgramArea(nodeItem)}><p style={{ display: 'block', marginTop: '5px', marginBottom: '-5px' }}>{nodeItem.node.name}</p></Button></td>
                            <td style={{ ...tdStyle, width: 150 }}>
                                <Switch
                                    checkedChildren={<Icon type="check" />}
                                    checked={this.validateArea(nodeItem.node.id)}
                                    unCheckedChildren={<Icon type="close" />}
                                    onChange={(event) => {
                                        this.activeInactiveProgram(event, nodeItem.node.id)
                                    }}
                                />
                            </td>
                            <td style={tdStyle}>
                                <i>{nodeItem.node.description}</i>
                            </td>
                            <td style={{ ...tdStyle, width: 150 }}>
                                <Progress width={60} type="dashboard" percent={this.getPercentageByProgramArea(nodeItem.node.id)} />
                            </td>
                        </tr>
                    ))}

                </table>

            </>

        )
    }
}
export default StudentDrawer
