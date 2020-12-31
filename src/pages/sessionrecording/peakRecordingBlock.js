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
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-lonely-if */

import React, { Component } from 'react'
import { Card, Progress, Typography, Button, Icon, notification } from 'antd'
import { connect } from 'react-redux'

const { Title, Text } = Typography

@connect(({ sessionrecording }) => ({ sessionrecording }))
class RecordingBlock extends Component {
  

  // componentWillMount(){
    
  // }

  componentDidMount() {
    const {
      dispatch,
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        PeakBlockIndex,
        PeakTrialCount,        
      },
    } = this.props

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        CurrentPeakBlocks: TargetResponse[TargetActiveId].peak,
      },
    })

    

    
  }

  updateSessionClockTime = () => {
    // updatig current clock time to store
    document.getElementById('updateSessionCurrentTimeInStore').click()
  }

  updateStartTrialClockTime = () => {
    // updatig trial start time to store
    document.getElementById('updateStartTrialTimeInStore').click()
  }

  resetZero = () => {
    document.getElementById('peakResponseButtonZero').style.color = 'gray'
    document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
  }

  resetTwo = () => {
    document.getElementById('peakResponseButtonTwo').style.color = 'gray'
    document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
  }

  resetFour = () => {
    document.getElementById('peakResponseButtonFour').style.color = 'gray'
    document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
  }

  resetEight = () => {
    document.getElementById('peakResponseButtonEight').style.color = 'gray'
    document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
  }

  resetTen = () => {
    document.getElementById('peakResponseButtonTen').style.color = 'gray'
    document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
  }

  peakSelectedStimulusIndexReset = (count) => {
    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props

    let sdList = null
    let ind = 0
    if (MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0) sdList = MasterSession.targets.edges[TargetActiveIndex].node.sd.edges
    if (sdList.length > 0){
      sdList.map((item, index) => {
        if(TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[count - 1].response?.sd?.id === item.node.id) ind = index
      })
    }

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SelectedPeakStimulusIndex: ind,
      },
    })

  }


  goToNextTrial = () => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, TargetActiveId, TargetResponse, PeakTrialCount, PeakAutomatic },
    } = this.props
    if (PeakTrialCount < 10) {
      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1]
          .recordedData === true
      ) {
        this.updateStartTrialClockTime()
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            PeakTrialCount: PeakTrialCount + 1,
          },
        })

        if (
          TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount].response
            ?.marks === 0
        ) {
          document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
        }
        if (
          TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount].response
            ?.marks === 2
        ) {
          document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount].response
            ?.marks === 4
        ) {
          document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount].response
            ?.marks === 8
        ) {
          document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount].response
            ?.marks === 10
        ) {
          document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
        }

        if (!PeakAutomatic){
          this.peakSelectedStimulusIndexReset(PeakTrialCount + 1)
        }

      } else {
        notification.warning({
          message: 'Warning!!',
          description: 'Record ' + PeakTrialCount + ' Trial first',
        })
      }
    }
  }

  goToPreviousTrial = () => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    this.updateStartTrialClockTime()
    const {
      dispatch,
      sessionrecording: { PeakTrialCount, TargetResponse, TargetActiveId, PeakBlockIndex, PeakAutomatic },
    } = this.props



    if (PeakTrialCount > 1) {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          PeakTrialCount: PeakTrialCount - 1,
        },
      })

      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 2].response
          .marks === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 2].response
          .marks === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 2].response
          .marks === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 2].response
          .marks === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 2].response
          .marks === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
      if (!PeakAutomatic){
        this.peakSelectedStimulusIndexReset(PeakTrialCount - 1)
      }

    }
  }

  goToPreviousBlock = () => {
    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, TargetActiveId },
    } = this.props
    if (PeakBlockIndex > 0) {
      this.updateSessionClockTime()
      dispatch({
        type: 'sessionrecording/UPDATE_BLOCK_ENDTIME',
        payload: {
          blockIndex: PeakBlockIndex,
          targetId: TargetActiveId,
        },
      })

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          PeakBlockIndex: PeakBlockIndex - 1,
        },
      })

      dispatch({
        type: 'sessionrecording/CREATE_NEW_BLOCK',
        payload: {
          blockIndex: PeakBlockIndex - 1,
          targetId: TargetActiveId,
        },
      })
    }
  }

  goToNextBlock = () => {
    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, TargetActiveId, MasterSession, TargetActiveIndex },
    } = this.props
    if (PeakBlockIndex < MasterSession.targets.edges[TargetActiveIndex].node.peakBlocks - 1) {
      this.updateSessionClockTime()
      dispatch({
        type: 'sessionrecording/UPDATE_BLOCK_ENDTIME',
        payload: {
          blockIndex: PeakBlockIndex,
          targetId: TargetActiveId,
        },
      })

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          PeakBlockIndex: PeakBlockIndex + 1,
        },
      })

      dispatch({
        type: 'sessionrecording/CREATE_NEW_BLOCK',
        payload: {
          blockIndex: PeakBlockIndex + 1,
          targetId: TargetActiveId,
        },
      })
    }
  }

  responseZero = prompt => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    // document.getElementById('peakResponseButtonZero').style.color = '#FF8080'
    document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props
    this.updateSessionClockTime()

    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].recordedData) {
      if (PeakAutomatic) {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 0,
            sd: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.sd.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }
      else {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 0,
            sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }

    } else {
      dispatch({
        type: 'sessionrecording/RECORD_BLOCK_TRIAL',
        payload: {
          marks: 0,
          sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
          promptId: prompt,
        },
      })
    }
  }

  responseTwo = prompt => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    // document.getElementById('peakResponseButtonTwo').style.color = '#FF9C52'
    document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props
    this.updateSessionClockTime()

    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].recordedData) {
      if (PeakAutomatic) {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 2,
            sd: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.sd.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }
      else {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 2,
            sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }

    } else {
      dispatch({
        type: 'sessionrecording/RECORD_BLOCK_TRIAL',
        payload: {
          marks: 2,
          sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
          promptId: prompt,
        },
      })
    }
  }

  responseFour = prompt => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    // document.getElementById('peakResponseButtonFour').style.color = '#FF9C52'
    document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props
    this.updateSessionClockTime()

    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].recordedData) {
      if (PeakAutomatic) {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 4,
            sd: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.sd.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }
      else {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 4,
            sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }

    } else {
      dispatch({
        type: 'sessionrecording/RECORD_BLOCK_TRIAL',
        payload: {
          marks: 4,
          sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
          promptId: prompt,
        },
      })
    }
  }

  responseEight = prompt => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    // document.getElementById('peakResponseButtonEight').style.color = '#FF9C52'
    document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props
    this.updateSessionClockTime()

    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].recordedData) {
      if (PeakAutomatic) {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 8,
            sd: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.sd.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }
      else {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 8,
            sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }

    } else {
      dispatch({
        type: 'sessionrecording/RECORD_BLOCK_TRIAL',
        payload: {
          marks: 8,
          sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
          promptId: prompt,
        },
      })
    }
  }

  responseTen = prompt => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    // document.getElementById('peakResponseButtonTen').style.color = '#4BAEA0'
    document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'

    const {
      dispatch,
      sessionrecording: { PeakBlockIndex, PeakAutomatic, TargetActiveId, TargetResponse, PeakTrialCount, SelectedPeakStimulusIndex, MasterSession, TargetActiveIndex },
    } = this.props
    this.updateSessionClockTime()

    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].recordedData) {
      if (PeakAutomatic) {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 10,
            sd: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.sd.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }
      else {
        dispatch({
          type: 'sessionrecording/UPDATE_BLOCK_TRIAL',
          payload: {
            marks: 10,
            sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
            promptId: prompt,
            responseId: TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1].response.id,
          },
        })
      }

    } else {
      dispatch({
        type: 'sessionrecording/RECORD_BLOCK_TRIAL',
        payload: {
          marks: 10,
          sd: MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[SelectedPeakStimulusIndex]?.node.id,
          promptId: prompt,
        },
      })
    }
  }

  changePeakStimulus = (operation, listLen) => {
    const { dispatch, sessionrecording: { SelectedPeakStimulusIndex } } = this.props
    if (operation === 'plus') {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedPeakStimulusIndex: SelectedPeakStimulusIndex + 2 > listLen ? 0 : (SelectedPeakStimulusIndex + 1),
        },
      })
    }
    if (operation === 'minus') {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedPeakStimulusIndex: SelectedPeakStimulusIndex - 1 < 0 ? (listLen-1) : (SelectedPeakStimulusIndex - 1),
        },
      })
    }
  }

  render() {
    const {
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        MasterSession,
        PeakBlockIndex,
        PeakTrialCount,
        TargetActiveIndex,
        SelectedPeakStimulusIndex,
        PeakAutomatic,
      },
    } = this.props

    // Setting latest selected trail button color
    // if (TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response?.marks === 0) {
    //   const getButton = document.getElementById('peakResponseButtonZero')
    //   if (typeof getButton != 'undefined' && getButton != null) {
    //     document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
    //   }
    // }
    const getButton0 = document.getElementById('peakResponseButtonZero')
    const getButton2 = document.getElementById('peakResponseButtonTwo')
    const getButton4 = document.getElementById('peakResponseButtonFour')
    const getButton8 = document.getElementById('peakResponseButtonEight')
    const getButton10 = document.getElementById('peakResponseButtonTen')


    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response?.marks === 0) {
      if (typeof getButton0 != 'undefined' && getButton0 != null) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
    }
    else{
      if (typeof getButton0 != 'undefined' && getButton0 != null) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
      }
    }

    
    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response?.marks === 2
    ) {
      if (typeof getButton2 != 'undefined' && getButton2 != null) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
    }
    else{
      if (typeof getButton2 != 'undefined' && getButton2 != null) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
      }
    }
    if (
      TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response
        ?.marks === 4
    ) {
      if (typeof getButton4 != 'undefined' && getButton4 != null) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
    }
    else{
      if (typeof getButton4 != 'undefined' && getButton4 != null) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
      }
    }


    if (
      TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response
        ?.marks === 8
    ) {
      if (typeof getButton8 != 'undefined' && getButton8 != null) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
    }
    else{
      if (typeof getButton8 != 'undefined' && getButton8 != null) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
      }
    }
    if (
      TargetResponse[TargetActiveId].peak[PeakBlockIndex].block[PeakTrialCount - 1].response
        ?.marks === 10
    ) {
      
      if (typeof getButton10 != 'undefined' && getButton10 != null) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
    else{
      if (typeof getButton10 != 'undefined' && getButton10 != null) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
      }
    }

    

    // const copylist = TargetResponse[TargetActiveId].peak
    let item = null
    if (TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block.length > 0) {
      item = TargetResponse[TargetActiveId].peak[PeakBlockIndex]?.block[PeakTrialCount - 1]
    }

    let sdList = null
    if (MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0) sdList = MasterSession.targets.edges[TargetActiveIndex].node.sd.edges

    // console.log('Item Object =======>', item)
    const recordingButtonStyle = {
      padding: '8px auto',
      width: '70px',
      height: '50px',
      marginTop: '10px',
      marginLeft: '5px',
      marginRight: '5px',
      backgroundColor: '#e4e9f0',
    }
    return (
      <>
        <div style={{ padding: '10px' }}>
          <div style={{ display: 'block', marginBottom: '5px' }}>
            Block {PeakBlockIndex + 1} /{' '}
            {MasterSession.targets.edges[TargetActiveIndex].node.peakBlocks}
            <Button
              style={{
                float: 'right',
                border: 'none',
                padding: '0px 10px',
                color: '#000',
                marginTop: '-7px',
              }}
              onClick={this.goToNextBlock}
            >
              <Icon type="right" />
            </Button>
            <Button
              style={{
                float: 'right',
                border: 'none',
                padding: '0px 10px',
                color: '#000',
                marginTop: '-7px',
              }}
              onClick={this.goToPreviousBlock}
            >
              <Icon type="left" />
            </Button>
            &nbsp;&nbsp;
          </div>
          {/* <br /> */}

          {PeakAutomatic ? 
            <Title level={4} style={{ lineHeight: '27px', display: 'inline-block' }}>
              Stimulus: {item?.response?.sd?.sd}
            </Title>

            :
            <>
              <Title level={4} style={{ lineHeight: '27px', display: 'inline-block' }}>
                Stimulus: {sdList[SelectedPeakStimulusIndex]?.node.sd}
              </Title>

              <span style={{ float: 'right', display: 'inline-block' }}>
                <Button style={{ border: 'none' }} onClick={() => this.changePeakStimulus('minus', sdList?.length)}>
                  <Icon type="left" />
                </Button>
                Stimulus {SelectedPeakStimulusIndex + 1} / {sdList.length}
                <Button style={{ border: 'none' }} onClick={() => this.changePeakStimulus('plus', sdList?.length)}>
                  <Icon type="right" />
                </Button>
              </span>
            </>
          }



          <br />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              id="peakResponseButtonZero"
              style={recordingButtonStyle}
              onClick={() => this.responseZero()}
            >
              0
            </Button>
            <Button
              id="peakResponseButtonTwo"
              style={recordingButtonStyle}
              onClick={() => this.responseTwo()}
            >
              2
            </Button>
            <Button
              id="peakResponseButtonFour"
              style={recordingButtonStyle}
              onClick={() => this.responseFour()}
            >
              4
            </Button>
            <Button
              id="peakResponseButtonEight"
              style={recordingButtonStyle}
              onClick={() => this.responseEight()}
            >
              8
            </Button>
            <Button
              id="peakResponseButtonTen"
              style={recordingButtonStyle}
              onClick={() => this.responseTen()}
            >
              10
            </Button>
          </div>
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button onClick={this.goToPreviousTrial}>
              <Icon type="left" />
            </Button>
            &nbsp; Trial {PeakTrialCount} / 10 &nbsp;
            <Button onClick={this.goToNextTrial}>
              <Icon type="right" />
            </Button>
          </div>
        </div>
      </>
    )
  }
}
export default RecordingBlock
