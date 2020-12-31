/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-else-return */
/* eslint-disable import/extensions */
import React, { Component } from 'react'
import { Button, Dropdown, Drawer, Card, Layout, Row, Col, Typography, Tooltip, Icon, notification, Modal, Menu } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import EquTargetCard from './EquTargetCard'
import UpdateTargetForm from './UpdateEquivalenceTarget'
import apolloClient from '../../apollo/config'

const { Content } = Layout
const { Title, Text } = Typography
const { confirm } = Modal
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

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class StudentDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            targetsList: [],
            selectedTargetId: '',
            selectedCode: '1A',
            editTargetVisible: false
        }
    }

    componentDidMount() {

        const { selectedCategory } = this.props
        apolloClient.query({
            query: gql`query{
                getPeakEquCodes(codetype:"${selectedCategory}"){
                    edges{
                        node{
                            id
                            code
                            target{
                                id
                                targetInstr
                                targetMain{
                                    id
                                    targetName
                                }
                            }
                            classes{
                                edges{
                                    node{
                                        id
                                        name
                                        stimuluses{
                                            edges{
                                                node{
                                                    id
                                                    option
                                                    stimulusName
                                                }
                                            }
                                        }
                                    }
                                }
                            }
            
                        }
                    }
                }
            }`,
            fetchPolicy: 'network-only',
        })
            .then(result => {
                this.setState({
                    targetsList: result.data.getPeakEquCodes.edges,
                    loading: false,
                })
            })
            .catch(error => {
                error.graphQLErrors.map(item => {
                    return notification.error({
                        message: 'Somthing went wrong',
                        description: item.message,
                    })
                })
            })

    }

    showEditDrawer = (node) => {
        // console.log("node----> ",node)
        this.setState({
            editTargetVisible: true,
            selectedCode: node.code
        })
    }

    updateTargetList = (details) => {
        // console.log(details)
        const { targetsList, selectedCode } = this.state
        let cloneTargetList = []
        cloneTargetList = [...targetsList.map(item => {
            if (item.node.code === selectedCode) {
                return {
                    node: {
                        ...item.node, target: details.target, classes: details.classes
                    },
                }  
            }
            else{
                return item
            }
        }
        )]

        this.setState({
            targetsList: cloneTargetList
        })


    }



    render() {

        const userRole = this.props.user.role
        const { targetsList, editTargetVisible, selectedCode, loading } = this.state

        if (loading) {
            return 'Loading...'
        }

        return (

            <div
                style={{
                    maxHeight: 600,
                    overflow: 'auto'
                }}
            >

                {targetsList.map(nodeItem => (
                    <EquTargetCard
                        key={nodeItem.node.id}
                        node={nodeItem.node}
                        showEditDrawer={this.showEditDrawer}
                    />
                ))}


                <Drawer
                    width="650px"
                    visible={editTargetVisible}
                    placement="right"
                    onClose={() => this.setState({ editTargetVisible: false })}
                    title="Update Target"
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: '#fff',
                            padding: 30,
                            paddingTop: 0,
                        }}
                    >
                        <UpdateTargetForm
                            key={selectedCode}
                            updateTargetList={this.updateTargetList}
                            selectedCode={selectedCode}
                        />
                    </div>
                </Drawer>
            </div>

        )
    }
}
export default StudentDrawer
