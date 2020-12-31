/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-var */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */

import React, { Component } from 'react'
import { Card, Progress, Typography } from 'antd'
import { connect } from 'react-redux'
import Scroll from 'react-scroll'
import TrialsList from './trialsList'

const { Element, Link } = Scroll
const peakId = 'VGFyZ2V0RGV0YWlsVHlwZTo4'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class Target extends Component {
  componentDidMount() {
    const {
      dispatch,
      sessionrecording: { loading, Disabled, TargetActiveId, TargetActiveIndex },
    } = this.props
    if (!loading) {
      document.getElementById(TargetActiveId).click()
      document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border =
        '2px solid #bae7ff'
    }
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
      console.log(targetVideoUrl)
      // const isVideoAvailable = true;
      // let res = targetVideoUrl.substring(18);
      //   const videoId = targetVideoUrl.substring(targetVideoUrl.lastIndexOf('/') + 1);
      let finalUrl = ''
      let splitList = []
      let videoId = ''
      splitList = targetVideoUrl.split('/')
      if (splitList.length > 3){
        if (targetVideoUrl.split('/')[2] === 'www.youtube.com'){
          finalUrl = targetVideoUrl
        }
        else{
          videoId = targetVideoUrl.split('/')[3]
          finalUrl = `https://player.vimeo.com/video/${videoId}/`
        }
        
      }


      // const videoId = targetVideoUrl.split('/')[3]
      // return videoId
      // console.log(videoId)

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          // VideoUrl: `https://player.vimeo.com/video/${videoId}/`,
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

  changeTarget = index => {
    const {
      dispatch,
      sessionrecording: { Disabled, TargetActiveId, MasterSession, TargetActiveIndex },
    } = this.props
    if (Disabled) {
      alert('Please Start Session Clock first')
    } else {
      // scrolling target to top
      document.getElementById(TargetActiveId).click()
      document.getElementsByClassName('targetElements')[index].style.border = '2px solid #bae7ff'
      document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'
      // updating start trial time
      this.updateStartTrialClockTime()
      // updatig current clock time to store
      this.updateSessionClockTime()
      // reseting response button color
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
          TargetActiveIndex: index,
          TargetActiveId: MasterSession.targets.edges[index].node.id,
          PeakTrialCount: 1,
          PeakBlockIndex: 0,
          StepActiveIndex: 0,
          StimulusActiveIndex: 0,
        },
      })

      // reset peak button style
      this.resetZero()
      this.resetTwo()
      this.resetFour()
      this.resetEight()
      this.resetTen()

      // checking new target recording if not exist creating new target skills model instance
      dispatch({
        type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
        payload: {
          targetId: MasterSession.targets.edges[index].node.id,
          targetIndex: index,
        },
      })

      // load video
      this.getVideoUrl(index)

    }


  }

  changeTargetWithStimulusIndex = (index, stimulusOrStepIndex) => {
    const {
      dispatch,
      sessionrecording: { Disabled, TargetActiveId, MasterSession, TargetActiveIndex },
    } = this.props
    if (Disabled) {
      alert('Please Start Session Clock first')
    } else {
      // scrolling target to top
      document.getElementById(TargetActiveId).click()
      document.getElementsByClassName('targetElements')[index].style.border = '2px solid #bae7ff'
      document.getElementsByClassName('targetElements')[TargetActiveIndex].style.border = 'none'
      // updating start trial time
      this.updateStartTrialClockTime()
      // updatig current clock time to store
      this.updateSessionClockTime()
      // reseting response button color
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
          TargetActiveIndex: index,
          TargetActiveId: MasterSession.targets.edges[index].node.id,
          PeakTrialCount: 1,
          PeakBlockIndex: 0,
          StepActiveIndex: 0,
          StimulusActiveIndex: 0,
        },
      })

      // reset peak button style
      this.resetZero()
      this.resetTwo()
      this.resetFour()
      this.resetEight()
      this.resetTen()

      // checking new target recording if not exist creating new target skills model instance
      dispatch({
        type: 'sessionrecording/CREATE_NEW_TARGET_INSTANCE',
        payload: {
          targetId: MasterSession.targets.edges[index].node.id,
          targetIndex: index,
          index: stimulusOrStepIndex,
        },
      })

      // load video
      this.getVideoUrl(index)

    }


  }

  changeStimulus = (e) => {
    e.preventDefault()
    // alert('clicked')
  }

  render() {
    const { Meta } = Card
    const {
      sessionrecording: { loading, MasterSession },
    } = this.props

    const trialsDivStyle = { marginTop: '25px' }

    if (loading) {
      return 'Loading Targets...'
    }

    return (
      <>
        <Element
          name="test7"
          className="element"
          id="containerElement"
          style={{
            position: 'relative',
            height: '500px',
            overflow: 'scroll',
            // marginBottom: '100px'
          }}
        >
          {MasterSession ? (
            MasterSession.targets.edges.map((item, index) => (
              <>
                <Element
                  className="targetElements"
                  style={{ padding: '4px', borderRadius: '8px' }}
                  name={item.node.id}
                >
                  {item.node.sd.edges.length > 0 ?
                    <>
                      {item.node.targetAllcatedDetails.targetType.id === peakId ?
                        <>
                          <a onClick={() => this.changeTarget(index)}>
                            <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                              <Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} />
                            </Card>
                          </a>
                        </>
                        :
                        <>
                          <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                            <a onClick={(e) => this.changeTarget(index)}><Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} /></a>
                            <div style={trialsDivStyle}>
                              <h6>Stimulus</h6>
                              {item.node.sd.edges.length > 0 ? (
                                <>
                                  {item.node.sd.edges.map((item2, stimulusIndex) => (
                                    <a onClick={(e) => this.changeTargetWithStimulusIndex(index, stimulusIndex)}>
                                      <>
                                        <span>{index+1} - {item2.node.sd} </span>
                                        <span>{item.node.mastery.edges.map(masteryItem => {masteryItem.node.sd.id === item2.node.id ? masteryItem.node.status?.statusName : ''})}</span>
                                        <br />
                                        <TrialsList
                                          key={item.node.id}
                                          id={item.node.id}
                                          sdKey={item2.node.id}
                                          stepKey=""
                                          dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                          boxWidth="20px"
                                        />
                                        <br />
                                      </>
                                    </a>
                                  ))}
                                </>
                              ) : item.node.steps.edges.length > 0 ? (
                                <>
                                  {item.node.steps.edges.map((item3, stepIndex) => (
                                    <a onClick={(e) => this.changeTargetWithStimulusIndex(index, stepIndex)}>
                                      <>
                                        <span>Step : {item3.node.step} </span>
                                        <br />
                                        <TrialsList
                                          key={item.node.id}
                                          id={item.node.id}
                                          sdKey=""
                                          stepKey={item3.node.id}
                                          dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                          boxWidth="20px"
                                        />
                                        <br />
                                      </>
                                    </a>
                                  ))}
                                </>
                              ) : (
                                    <TrialsList
                                      key={item.node.id}
                                      id={item.node.id}
                                      sdKey=""
                                      stepKey=""
                                      dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                      boxWidth="20px"
                                    />
                                  )}
                            </div>
                          </Card>

                        </>

                      }
                    </>
                    :
                    <>
                      {item.node.steps.edges.length > 0 ?
                        <>
                          {item.node.targetAllcatedDetails.targetType.id === peakId ?
                            <>
                              <a onClick={() => this.changeTarget(index)}>
                                <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                                  <Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} />
                                </Card>
                              </a>
                            </>
                            :
                            <>
                              <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                                <a onClick={(e) => this.changeTarget(index)}><Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} /></a>
                                <div style={trialsDivStyle}>
                                  <h6>Steps</h6>
                                  {item.node.sd.edges.length > 0 ? (
                                    <>
                                      {item.node.sd.edges.map((item2, stimulusIndex) => (
                                        <a onClick={(e) => this.changeTargetWithStimulusIndex(index, stimulusIndex)}>
                                          <>
                                            <span>Stimulus : {item2.node.sd} </span>
                                            <br />
                                            <TrialsList
                                              key={item.node.id}
                                              id={item.node.id}
                                              sdKey={item2.node.id}
                                              stepKey=""
                                              dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                              boxWidth="20px"
                                            />
                                            <br />
                                          </>
                                        </a>
                                      ))}
                                    </>
                                  ) : item.node.steps.edges.length > 0 ? (
                                    <>
                                      {item.node.steps.edges.map((item3, stepIndex) => (
                                        <a onClick={(e) => this.changeTargetWithStimulusIndex(index, stepIndex)}>
                                          <>
                                            <span>{index+1} - {item3.node.step} </span>
                                            <span>{item.node.mastery.edges.map(masteryItem => {masteryItem.node.step.id === item3.node.id ? masteryItem.node.status?.statusName : ''})}</span>
                                            <br />
                                            <TrialsList
                                              key={item.node.id}
                                              id={item.node.id}
                                              sdKey=""
                                              stepKey={item3.node.id}
                                              dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                              boxWidth="20px"
                                            />
                                            <br />
                                          </>
                                        </a>
                                      ))}
                                    </>
                                  ) : (
                                        <TrialsList
                                          key={item.node.id}
                                          id={item.node.id}
                                          sdKey=""
                                          stepKey=""
                                          dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                          boxWidth="20px"
                                        />
                                      )}
                                </div>
                              </Card>

                            </>

                          }
                        </>
                        :
                        <>
                          <a onClick={() => this.changeTarget(index)}>
                            <>
                              {item.node.targetAllcatedDetails.targetType.id === peakId ?
                                <>
                                  <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                                    <Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} />
                                  </Card>
                                </>
                                :
                                <>
                                  <Card hoverable style={{ width: '100%', maxHeight: '350px' }}>
                                    <a onClick={(e) => this.changeStimulus(e)}><Meta title={`Target : `+ item.node.targetAllcatedDetails.targetName} /></a>
                                    <div style={trialsDivStyle}>
                                      {item.node.sd.edges.length > 0 ? (
                                        <>
                                          {item.node.sd.edges.map(item2 => (
                                            <>
                                              <span>Stimulus : {item2.node.sd} </span>
                                              <br />
                                              <TrialsList
                                                key={item.node.id}
                                                id={item.node.id}
                                                sdKey={item2.node.id}
                                                stepKey=""
                                                dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                                boxWidth="20px"
                                              />
                                              <br />
                                            </>
                                          ))}
                                        </>
                                      ) : item.node.steps.edges.length > 0 ? (
                                        <>
                                          {item.node.steps.edges.map(item3 => (
                                            <>
                                              <span>Step : {item3.node.step} </span>
                                              <br />
                                              <TrialsList
                                                key={item.node.id}
                                                id={item.node.id}
                                                sdKey=""
                                                stepKey={item3.node.id}
                                                dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                                boxWidth="20px"
                                              />
                                              <br />
                                            </>
                                          ))}
                                        </>
                                      ) : (
                                            <TrialsList
                                              key={item.node.id}
                                              id={item.node.id}
                                              sdKey=""
                                              stepKey=""
                                              dailyTrails={item.node.targetAllcatedDetails.DailyTrials}
                                              boxWidth="20px"
                                            />
                                          )}
                                    </div>
                                  </Card>

                                </>

                              }
                            </>
                          </a>
                        </>
                      }
                    </>

                  }

                </Element>
                <Link
                  activeClass="active"
                  id={item.node.id}
                  to={item.node.id}
                  spy={true}
                  smooth={true}
                  duration={250}
                  style={{ display: 'hidden' }}
                  containerId="containerElement"
                >
                  &nbsp;
                </Link>
              </>
            ))
          ) : (
              <p>Loading Targets...</p>
            )}
        </Element>
      </>
    )
  }
}
export default Target
