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
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Layout,
    Row,
    Col,
    Typography,
} from 'antd'
import { connect } from 'react-redux'
import Authorize from '../../components/LayoutComponents/Authorize'
import ScreeingCards from './screeningCards'
import RightArea from './rightArea'


const { Title, Text } = Typography
const { Content } = Layout

@connect(({ screening }) => ({ screening }))
class Screeing extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'screening/LOAD_DATA'
        })
    }

    render() {
        const { screening: { loading } } = this.props
        if (loading) {
            return "Loading..."
        }

        return (
            <>
                <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
                    <Helmet title="Screening" />
                    <Layout style={{ padding: '0px' }}>
                        <Content
                            style={{
                                padding: '0px 20px',
                                maxWidth: 1300,
                                width: '100%',
                                margin: '0px auto',
                            }}
                        >
                            <Row>
                                <Col sm={8}>
                                    <ScreeingCards />
                                </Col>
                                <Col sm={16}>
                                    <RightArea />
                                </Col>
                            </Row>
                        </Content>
                    </Layout>
                </Authorize>
            </>
        )
    }
}

export default Screeing
