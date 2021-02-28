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
/* eslint-disable react/no-did-update-set-state */

import React from 'react'
import { Helmet } from 'react-helmet'
import ReactPlayer from 'react-player'
import {
  Row,
  Col,
  Card,
  Drawer,
  Select,
  Form,
  Collapse,
  Tree,
  Icon,
  DatePicker,
  notification,
  Empty,
  Button,
  Typography,
} from 'antd'
import { Redirect } from 'react-router-dom'
import Authorize from 'components/LayoutComponents/Authorize'
import { connect } from 'react-redux'
import moment from 'moment'
import ParentFeedback from './parentFeedback'
import TherapistFeedback from './therapistFeedback'

const { Title, Text } = Typography
const { Panel } = Collapse

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
    as a welcome guest in many households across the world.
  </p>
)

@connect(({ user, feedback }) => ({ user, feedback }))
class DataRecording extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'feedback/GET_QUESTIONS',
    })
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return 'Loading data...'
    }

    return (
      <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Session" />
        <Row>
          <Col span={24}>
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Panel header="Parent Feedback" key="1">
                <ParentFeedback />
              </Panel>
              <Panel header="Therapist Feedback" key="2">
                <TherapistFeedback />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Authorize>
    )
  }
}

export default DataRecording
