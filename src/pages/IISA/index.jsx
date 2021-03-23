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

import React from 'react'
import { Helmet } from 'react-helmet'
import { Layout, Row, Col } from 'antd'
import { connect } from 'react-redux'
import LoadingComponent from 'components/LoadingComponent'
import actions from 'redux/iisaassessment/actions'
import RightArea from './rightArea'

const { Content } = Layout

@connect(({ user, iisaassessment, learnersprogram }) => ({
  user,
  iisaassessment,
  learnersprogram,
}))
class Screeing extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.onRenderWithoutID()
  }

  onRenderWithoutID = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'learnersprogram/LOAD_DATA',
    })
  }

  render() {
    const {
      learnersprogram: { Loading },
    } = this.props

    if (Loading) {
      return <LoadingComponent />
    }

    return (
      <>
        <Helmet title="IISA Assessment" />
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
              <Col sm={24}>
                <RightArea style={{ marginRight: '10px' }} />
              </Col>
            </Row>
          </Content>
        </Layout>
      </>
    )
  }
}

export default Screeing
