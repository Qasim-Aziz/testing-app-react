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
import React, { Component } from 'react'
import { Button, Dropdown, Drawer, Card, Layout, Row, Col, Typography, Tooltip, Icon, notification, Modal, Menu } from 'antd'
import { connect } from 'react-redux'
import { gql } from 'apollo-boost'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import EquivalenceTargetCard from './EquivalenceTargetsCard'
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
            categoryList: [],
            selectedCategory: 'Reflexivity',


        }
    }

    componentDidMount() {
        apolloClient.query({
            query: gql`query {
                peakEquDomains{
                    id
                    name
                }
            }`,
            fetchPolicy: 'network-only',
        })
            .then(result => {
                this.setState({
                    categoryList: result.data.peakEquDomains
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

    handleSelectCategory = name => {
        this.setState({
            selectedCategory: name
        })
    }

    confirmDeleteTarget = () => {
        confirm({
            title: 'Are you sure you want to delete this?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('sjahd')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    


    render() {
        const { categoryList, selectedCategory } = this.state
        const userRole = this.props.user.role

       

        return (
            <Row gutter={[52, 0]}>
                <Col style={{ maxWidth: 460 }} span={8}>
                    <Card
                        style={{
                            background: '#F1F1F1',
                            borderRadius: 0,
                            minHeight: '75vh',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 26,
                            }}
                        >

                            <Title style={{ fontSize: 24, fontWeight: 'bold', lineHeight: '33px' }}>Category</Title>
                        </div>
                        {categoryList.map(item => (
                            <div
                                onClick={() => this.handleSelectCategory(item.name)}
                                style={{
                                    background: item.name === selectedCategory ? '#a7a6a6' : '#FFF',
                                    borderBottom: '1px solid #bcbcbc',
                                    cursor: 'pointer',
                                    padding: 18,
                                    borderRadius: 0,
                                    width: '100%',
                                    height: 50,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Title
                                    style={{
                                        color: item.name === selectedCategory ? '#000' : '#000',
                                        fontSize: 16,
                                        lineHeight: '25px',
                                        display: 'inline',
                                        margin: 0,
                                        fontWeight: '500',
                                    }}
                                >
                                    {item.name}
                                </Title>
                            </div>
                        ))}



                    </Card>

                </Col>
                <Col span={16}>
                    <EquivalenceTargetCard selectedCategory={selectedCategory} key={selectedCategory} />
                </Col>
            </Row>
        )
    }
}
export default StudentDrawer
