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
/* eslint-disable prefer-destructuring */
/* eslint-disable import/extensions */

import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  notification,
  Row,
  Typography,
  Icon,
  Tooltip,
} from 'antd'
import { gql } from 'apollo-boost'
import moment from 'moment'
import React from 'react'
import { Helmet } from 'react-helmet'
import ReactPlayer from 'react-player'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoadingComponent from 'components/LoadingComponent'
import Authorize from 'components/LayoutComponents/Authorize'
import SessionClock from 'components/sessionRecording/sessionClock'
import TargetListBlock from 'components/sessionRecording/targetListBlock'
import TrialsList from 'components/sessionRecording/trialsList'
import apolloClient from 'apollo/config'
import DataRecordingBlock from './dataRecordingBlock'
import EquivalenceRecordingBlock from './EquivalenceRecordingBlock'
import EquivalenceScoreBoard from './EquivalenceScoreBoard'
import PeakRecordingBlock from './peakRecordingBlock'
import RecordView from './RecordView'
import TargetResponseGraph from './TargetResponseGraph'
import PeakTrialBoxes from './trialsBoxes'

const { Title, Text } = Typography
const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'
const equivalence = 'EQUIVALENCE'

@connect(({ sessionrecording, user }) => ({ sessionrecording, user }))
class DataRecording extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // for behavior recording drawer
      visible: false,
      // for target instruction drawer
      targetVisible: false,
      videoVisible: false,
      graphVisible: false,
      // redirecting sessionId does not exist
      redirect: false,
      videoLoading: false,
      videoUrl: null,
      showVideo: true,
    }
  }

  componentDidMount() {
    const {
      dispatch,
      sessionrecording: { SessionId, SessionDate },
      user: { id },
    } = this.props

    apolloClient
      .query({
        query: gql`
          query GetUserSettings($id: ID!) {
            userSettings(user: $id) {
              edges {
                node {
                  id
                  peakAutomaticBlocks
                }
              }
            }
          }
        `,
        variables: {
          id,
        },
        fetchPolicy: 'network-only',
      })
      .then(result => {
        if (result && result.data && result.data.userSettings.edges.length > 0) {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              PeakAutomatic: result.data.userSettings.edges[0]?.node.peakAutomaticBlocks,
            },
          })
        }
      })
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong loading user settings',
            description: item.message,
          })
        })
      })

    if (SessionId === '') {
      this.setState({
        redirect: true,
        // redirect: false,
      })
    } else {
      dispatch({
        type: 'sessionrecording/LOAD_SESSION',
        payload: {
          masterSessionId: SessionId,
          date: SessionDate !== null ? SessionDate : moment().format('YYYY-MM-DD'),
          // masterSessionId: 'U2Vzc2lvblR5cGU6MjI0NA==',
        },
      })
    }

    // dispatch({
    //   type: 'sessionrecording/LOAD_SESSION',
    //   payload: {
    //     // masterSessionId: SessionId,
    //     date: SessionDate !== null ? SessionDate : moment().format('YYYY-MM-DD'),
    //     masterSessionId: 'U2Vzc2lvblR5cGU6NDQ1OA==',
    //   },
    // })
  }

  getVideoUrl(index) {
    const {
      dispatch,
      sessionrecording: { MasterSession, TargetActiveIndex },
    } = this.props
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        VideoUrl: '',
        VideoLoading: true,
      },
    })
    if (MasterSession.targets.edges[index].node.videos.edges.length > 0) {
      const videoNode = MasterSession.targets.edges[index].node.videos.edges[0]
      const targetVideoUrl = videoNode.node.url
      let finalUrl = ''
      let splitList = []
      let videoId = ''
      splitList = targetVideoUrl.split('/')
      if (splitList.length > 3) {
        if (targetVideoUrl.split('/')[2] === 'www.youtube.com') {
          finalUrl = targetVideoUrl
        } else {
          videoId = targetVideoUrl.split('/')[3]
          finalUrl = `https://player.vimeo.com/video/${videoId}/`
        }
      }

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          VideoUrl: finalUrl,
          VideoAvailable: true,
          VideoLoading: false,
        },
      })
    } else {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          VideoAvailable: false,
          VideoLoading: false,
        },
      })
    }
  }

  showDrawer = () => {
    this.setState({ visible: true })
  }

  onClose = () => {
    this.setState({ visible: false })
  }

  showTargetDrawer = () => {
    this.setState({ targetVisible: true })
  }

  onTargetClose = () => {
    this.setState({ targetVisible: false })
  }

  showVideoDrawer = () => {
    this.setState({ videoVisible: true })
  }

  onVideoClose = () => {
    this.setState({ videoVisible: false })
  }

  showGraphDrawer = () => {
    this.setState({ graphVisible: true })
  }

  onGraphClose = () => {
    this.setState({ graphVisible: false })
  }

  resetZero = () => {
    var element = document.getElementById('peakResponseButtonZero')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('peakResponseButtonZero').style.color = 'gray'
      document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
    }
  }

  resetTwo = () => {
    var element = document.getElementById('peakResponseButtonTwo')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('peakResponseButtonTwo').style.color = 'gray'
      document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
    }
  }

  resetFour = () => {
    var element = document.getElementById('peakResponseButtonFour')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('peakResponseButtonFour').style.color = 'gray'
      document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
    }
  }

  resetEight = () => {
    var element = document.getElementById('peakResponseButtonEight')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('peakResponseButtonEight').style.color = 'gray'
      document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
    }
  }

  resetTen = () => {
    var element = document.getElementById('peakResponseButtonTen')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('peakResponseButtonTen').style.color = 'gray'
      document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
    }
  }

  resetCorrectIncorrectButtonStyle = () => {
    var element = document.getElementById('correctResponseButton')

    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof element != 'undefined' && element != null) {
      document.getElementById('correctResponseButton').style.color = 'gray'
      document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
      document.getElementById('incorrectResponseButton').style.color = 'gray'
      document.getElementById('incorrectResponseButton').style.borderColor = '#e4e9f0'
    } else {
      console.log('Buttons does not not exits')
    }
  }

  updateSessionClockTime = () => {
    // updatig current clock time to store
    document.getElementById('updateSessionCurrentTimeInStore').click()
  }

  updateStartTrialClockTime = () => {
    // updatig trial start time to store
    document.getElementById('updateStartTrialTimeInStore').click()
  }

  changeTarget = () => {
    const {
      dispatch,
      sessionrecording: {
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
      },
    } = this.props

    document.getElementById(MasterSession.targets.edges[TargetActiveIndex + 1].node.id).click()
    document.getElementsByClassName('targetElements')[TargetActiveIndex + 1].style.border =
      '2px solid #bae7ff'
    document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'

    // updating start trial time
    this.updateStartTrialClockTime()
    // updatig current clock time to store
    this.updateSessionClockTime()
    this.resetCorrectIncorrectButtonStyle()
    // updating previous target end time
    dispatch({
      type: 'sessionrecording/TARGET_UPDATE',
      payload: {
        targetId: TargetActiveId,
      },
    })

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetActiveIndex: TargetActiveIndex + 1,
        TargetActiveId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
        PeakTrialCount: 1,
        PeakBlockIndex: 0,
        StepActiveIndex: 0,
        StimulusActiveIndex: 0,
        EquiTrialCount: 1,
      },
    })

    // reset peak button style
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    // creating new target skills model instance
    dispatch({
      type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
      payload: {
        targetId: MasterSession.targets.edges[TargetActiveIndex + 1].node.id,
        targetIndex: TargetActiveIndex + 1,
      },
    })

    // load video
    this.getVideoUrl(TargetActiveIndex + 1)
  }

  moveToPreviousTarget = () => {
    const {
      dispatch,
      sessionrecording: {
        TargetActiveIndex,
        TargetActiveId,
        MasterSession,
        CorrectCount,
        IncorrectCount,
        Count,
      },
    } = this.props
    // updating start trial time
    this.updateStartTrialClockTime()
    // updatig current clock time to store
    this.updateSessionClockTime()
    this.resetCorrectIncorrectButtonStyle()
    // updating previous target end time
    dispatch({
      type: 'sessionrecording/TARGET_UPDATE',
      payload: {
        targetId: TargetActiveId,
      },
    })

    document.getElementById(MasterSession.targets.edges[TargetActiveIndex - 1].node.id).click()
    document.getElementsByClassName('targetElements')[TargetActiveIndex - 1].style.border =
      '2px solid #bae7ff'
    document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TargetActiveIndex: TargetActiveIndex - 1,
        TargetActiveId: MasterSession.targets.edges[TargetActiveIndex - 1].node.id,
        PeakTrialCount: 1,
        PeakBlockIndex: 0,
        StepActiveIndex: 0,
        StimulusActiveIndex: 0,
        EquiTrialCount: 1,
      },
    })

    // reset peak button style
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    // Updating target index and target id to store
    dispatch({
      type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
      payload: {
        targetIndex: TargetActiveIndex - 1,
        targetId: MasterSession.targets.edges[TargetActiveIndex - 1].node.id,
      },
    })

    // load video
    this.getVideoUrl(TargetActiveIndex - 1)
  }

  // Switch between video and target function

  toggleShowVideo = () => {
    const { showVideo } = this.state
    if (showVideo) {
      this.setState({
        showVideo: false,
      })
    } else {
      this.setState({
        showVideo: true,
      })
    }
  }

  render() {
    const {
      sessionrecording: {
        loading,
        Disabled,
        MasterSession,
        TargetActiveIndex,
        ChildSession,
        VideoAvailable,
        VideoLoading,
        VideoUrl,
        TargetActiveId,
        StimulusActiveId,
        StepActiveId,
        ResponseLoading,
        SelectedPeakStimulusIndex,
      },
    } = this.props

    // const dis = false

    const style2 = Disabled
      ? {
        border: '2px solid #f4f6f8',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '600px',
        pointerEvents: 'none',
        opacity: '0.4',
      }
      : {
        border: '2px solid #f4f6f8',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '600px',
      }

    const style3 = {
      border: '2px solid #f4f6f8',
      height: '600px',
      backgroundColor: 'white',
      padding: '10px',
    }
    const targetBlockStyle = { height: '450px', overflow: 'auto' }
    const borderOnePixel = { border: '1px solid #f4f6f8' }

    const { redirect, showVideo } = this.state

    if (redirect) {
      return <Redirect to="/" />
    }

    if (loading) {
      return <LoadingComponent />
    }

    const buttonStyle = { marginTop: 15, marginLeft: 5, marginRight: 5 }
    const badgeStyle = {
      marginLeft: '10px',
      marginBottom: '8px',
      background: '#1890ff',
    }

    return (
      <Authorize roles={['school_admin', 'therapist', 'parents']} redirect to="/dashboard/beta">
        <Helmet title="Session" />
        {MasterSession && (
          <Row>
            {/* Main target recording area */}
            <Col xs={24} sm={18} md={18} lg={18} xl={18} style={style2}>
              {/* Header block details */}
              <Card bodyStyle={{ padding: '5px' }}>
                {MasterSession?.targets.edges.length > 0 ? (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <Title level={3} style={{ display: 'inline-block' }}>
                        Target :{' '}
                        {
                          MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                            .targetName
                        }
                      </Title>

                      <span style={{ float: 'right', display: 'inline-block' }}>
                        {TargetActiveIndex === 0 ? (
                          <Button style={{ marginRight: '10px' }} disabled>
                            <Icon type="left" />
                          </Button>
                        ) : (
                            <Button
                              style={{ marginRight: '10px' }}
                              onClick={this.moveToPreviousTarget}
                            >
                              <Icon type="left" />
                            </Button>
                          )}
                        Target {TargetActiveIndex + 1} / {MasterSession.targets.edgeCount}
                        {MasterSession?.targets.edgeCount > TargetActiveIndex + 1 ? (
                          <Button style={{ marginLeft: '10px' }} onClick={this.changeTarget}>
                            <Icon type="right" />
                          </Button>
                        ) : (
                            <Button style={{ marginLeft: '10px' }} disabled>
                              <Icon type="right" />
                            </Button>
                          )}
                      </span>
                    </div>

                    <div>
                      <Tooltip placement="topLeft" title="Target Instructions">
                        <Button style={buttonStyle} onClick={this.showTargetDrawer}>
                          <Icon type="ordered-list" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="topLeft" title="Behavior Recording">
                        <Button style={buttonStyle} onClick={this.showDrawer}>
                          <Icon type="play-circle" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="topLeft" title="Target Video">
                        <Button style={buttonStyle} onClick={this.showVideoDrawer}>
                          <Icon type="youtube" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="topLeft" title="Target Response Graph">
                        <Button style={buttonStyle} onClick={this.showGraphDrawer}>
                          <Icon type="line-chart" />
                        </Button>
                      </Tooltip>

                      <Badge
                        style={badgeStyle}
                        count={
                          MasterSession?.targets.edges[TargetActiveIndex].node?.targetStatus
                            ?.statusName
                        }
                      />

                      <Badge
                        style={badgeStyle}
                        count={
                          MasterSession?.targets.edges[TargetActiveIndex]?.node
                            .targetAllcatedDetails.targetType.typeTar
                        }
                      />
                      {MasterSession?.targets.edges[TargetActiveIndex]?.node.targetAllcatedDetails
                        .targetType.id === peakId && (
                          <Badge
                            style={badgeStyle}
                            count={MasterSession?.targets.edges[TargetActiveIndex]?.node.peakType}
                          />
                        )}
                    </div>
                  </>
                ) : (
                    ''
                  )}
              </Card>
              {/* End of Header block details */}
              <Row>
                {/* Target recording section */}
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {MasterSession?.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                    .targetType.id === peakId ? (
                      <>
                        {MasterSession?.targets.edges[TargetActiveIndex].node.peakType ===
                          equivalence ? (
                            <EquivalenceRecordingBlock key={TargetActiveIndex} />
                          ) : (
                            <PeakRecordingBlock />
                          )}
                      </>
                    ) : (
                      <DataRecordingBlock />
                    )}
                  {/* <EquivalenceRecordingBlock /> */}
                </Col>
                {/* End of Target recording section */}
              </Row>
              {/* Trials list section */}
              <Card bodyStyle={{ padding: '5px', border: 'none' }} style={{ border: 'none' }}>
                {MasterSession?.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                  .targetType.id === peakId ? (
                    <>
                      {MasterSession.targets.edges[TargetActiveIndex].node.peakType ===
                        equivalence ? (
                          // <p>1</p>
                          <EquivalenceScoreBoard key={TargetActiveIndex} />
                        ) : (
                          <PeakTrialBoxes trails={10} boxWidth="45px" boxHeight="20px" />
                        )}
                    </>
                  ) : (
                    <>
                      {/* {MasterSession?.targets.edges[TargetActiveIndex].node.sd.edges.length > 0 ? (
                        <>
                          {MasterSession?.targets.edges[TargetActiveIndex].node.sd.edges.map(
                            item2 => (
                              <>
                                <span>Stimulus : {item2.node.sd} </span>
                                <br />
                                <TrialsList
                                  key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                  id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                  sdKey={item2.node.id}
                                  stepKey=""
                                  dailyTrails={
                                    MasterSession.targets.edges[TargetActiveIndex].node
                                      .targetAllcatedDetails.DailyTrials
                                  }
                                  boxWidth="35px"
                                />
                                <br />
                              </>
                            ),
                          )}
                        </>
                      ) : MasterSession?.targets.edges[TargetActiveIndex].node.steps.edges.length >
                        0 ? (
                            <>
                              {MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.map(
                                item3 => (
                                  <>
                                    <span>Step : {item3.node.step} </span>
                                    <br />
                                    <TrialsList
                                      key={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                      id={MasterSession.targets.edges[TargetActiveIndex].node.id}
                                      sdKey=""
                                      stepKey={item3.node.id}
                                      dailyTrails={
                                        MasterSession.targets.edges[TargetActiveIndex].node
                                          .targetAllcatedDetails.DailyTrials
                                      }
                                      boxWidth="35px"
                                    />
                                    <br />
                                  </>
                                ),
                              )}
                            </>
                          ) : (
                            <TrialsList
                              key={MasterSession?.targets.edges[TargetActiveIndex].node.id}
                              id={MasterSession?.targets.edges[TargetActiveIndex].node.id}
                              sdKey=""
                              stepKey=""
                              dailyTrails={
                                MasterSession?.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                                  .DailyTrials
                              }
                              boxWidth="35px"
                            />
                          )} */}
                    </>
                  )}
              </Card>
              {/* End of Trials list section */}
              {this.state.visible && (
                <Drawer
                  height="90%"
                  placement="bottom"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                  getContainer={false}
                  style={{ position: 'absolute' }}
                  className="br-drawer"
                >
                  <RecordView />
                </Drawer>
              )}
              <Drawer
                title="Target Instruction"
                width="40%"
                placement="left"
                closable={false}
                onClose={this.onTargetClose}
                visible={this.state.targetVisible}
                getContainer={false}
                style={{ position: 'absolute' }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: MasterSession?.targets.edges[TargetActiveIndex].node.targetInstr,
                  }}
                />
              </Drawer>
              <Drawer
                title="Target Video"
                width="40%"
                placement="left"
                closable={false}
                onClose={this.onVideoClose}
                visible={this.state.videoVisible}
                getContainer={false}
                style={{ position: 'absolute' }}
              >
                <Card bodyStyle={{ padding: '5px', border: 'none' }} style={{ border: 'none' }}>
                  {MasterSession?.targets.edges[TargetActiveIndex].node.videos.edges.length > 0 ? (
                    <>
                      {/* <iframe
                        width="100%"
                        height="250px"
                        title="0"
                        src={MasterSession.targets.edges[TargetActiveIndex].node.videos.edges[0].node.url}
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      /> */}
                      {VideoLoading === true ? (
                        <p>Loading video...</p>
                      ) : (
                          <>
                            {VideoAvailable === true ? (
                              <ReactPlayer url={VideoUrl} controls height="250px" width="100%" />
                            ) : (
                                <Empty />
                              )}
                          </>
                        )}
                    </>
                  ) : (
                      <Empty style={{ height: '250px' }} />
                    )}
                </Card>
              </Drawer>
              <Drawer
                title="Target Response Graph"
                width="65%"
                placement="left"
                closable={false}
                onClose={this.onGraphClose}
                visible={this.state.graphVisible}
                getContainer={false}
                style={{ position: 'absolute' }}
              >
                <Card
                  bodyStyle={{ padding: '5px', border: 'none', height: '250' }}
                  style={{ border: 'none' }}
                >
                  <TargetResponseGraph
                    key={
                      MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0
                        ? StimulusActiveId + SelectedPeakStimulusIndex
                        : MasterSession.targets.edges[TargetActiveIndex].node.steps.edges
                          .length > 0
                          ? StepActiveId
                          : TargetActiveId
                    }
                    targetId={MasterSession.targets.edges[TargetActiveIndex].node.id}
                    sessionId={MasterSession?.id}
                  />
                </Card>
              </Drawer>
            </Col>
            {/* End of Main target recording area */}
            {/* clock and target list portion */}
            <Col xs={0} sm={6} md={6} lg={6} xl={6} style={style3}>
              <div style={{ borderBottom: '1px solid #ccc' }}>
                <SessionClock />
              </div>
              <div style={targetBlockStyle}>
                <TargetListBlock />
              </div>
            </Col>
            {/* End of clock and target list portion */}
          </Row>
        )}
      </Authorize>
    )
  }
}

export default DataRecording
