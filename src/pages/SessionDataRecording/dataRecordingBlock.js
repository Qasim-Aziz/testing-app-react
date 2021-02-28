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
/* eslint-disable vars-on-top */

import React from 'react'
import { Button, Icon, Row, Col, notification, Popconfirm, Input, Typography } from 'antd'
import { connect } from 'react-redux'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import LoadingComponent from 'components/LoadingComponent'

import NormalTargetScoreBoard from './NormalTargetScoreBoard'

const error = 'Error'
const incorrect = 'Incorrect'
const { Title, Text } = Typography

@connect(({ sessionrecording }) => ({ sessionrecording }))
class DataRecordingBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showPromptOptions: true,
      note: '',
    }
  }

  showPrompt = () => {
    this.setState({
      showPromptOptions: false,
    })
  }

  closePromptOptions = () => {
    this.setState({
      showPromptOptions: true,
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

  addCorrectTrailButtonStyle = () => {
    document.getElementById('correctResponseButton').style.color = '#4BAEA0'
    document.getElementById('correctResponseButton').style.borderColor = '#4BAEA0'
    document.getElementById('incorrectResponseButton').style.color = 'gray'
    document.getElementById('incorrectResponseButton').style.borderColor = '#e4e9f0'
  }

  addPromptTrailButtonStyle = () => {
    document.getElementById('correctResponseButton').style.color = 'gray'
    document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
    document.getElementById('incorrectResponseButton').style.color = '#FF9C52'
    document.getElementById('incorrectResponseButton').style.borderColor = '#FF9C52'
  }

  addInCorrectTrailButtonStyle = () => {
    document.getElementById('correctResponseButton').style.color = 'gray'
    document.getElementById('correctResponseButton').style.borderColor = '#e4e9f0'
    document.getElementById('incorrectResponseButton').style.color = '#FF8080'
    document.getElementById('incorrectResponseButton').style.borderColor = '#FF8080'
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

  addCorrectTrail = val => {
    this.addCorrectTrailButtonStyle()
    const {
      dispatch,
      sessionrecording: { CorrectCount },
    } = this.props
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        CorrectCount: CorrectCount + 1,
      },
    })
  }

  addPromptTrail = val => {
    this.addPromptTrailButtonStyle()
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: { IncorrectCount },
    } = this.props

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        IncorrectCount: IncorrectCount + 1,
      },
    })
  }

  addInCorrectTrail = val => {
    this.addInCorrectTrailButtonStyle()
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: { IncorrectCount },
    } = this.props

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        IncorrectCount: IncorrectCount + 1,
      },
    })
  }

  resetNote = () => {
    this.setState({
      note: '',
    })
    console.log('called')
  }

  setNoteText = object => {
    if (object.text) {
      this.setState({
        note: object.text,
      })
    } else {
      this.setState({
        note: '',
      })
    }
  }

  trialAutoMove = operation => {
    console.log('auto trial move called')

    const {
      dispatch,
      sessionrecording: { MasterSession, TargetActiveIndex, Count },
    } = this.props

    if (operation === 'sd') {
      this.moveToNextSDTrail()
    }
  }

  addCount = val => {
    const { note } = this.state
    const {
      dispatch,
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        Count,
        IncorrectCount,
        CorrectCount,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].target[Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].target[Count - 1]
        this.addCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_TRIAL',
          payload: {
            object: trialObject,
            response: 'Correct',
            promptId: '',
            note,
          },
        })

        if (!(trialObject.trial === 'CORRECT')) {
          console.log('entred')
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount - 1,
              CorrectCount: CorrectCount + 1,
            },
          })
        }
      } else {
        this.addCorrectTrail(val)

        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_CORRECT',
          payload: {
            response: 'Correct',
            promptId: '',
            note,
          },
        })
      }
    }

    this.resetNote()
  }

  promptCount = (val, promptObject) => {
    const { note } = this.state
    console.log('====> note <==== ', note)

    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].target[Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].target[Count - 1]
        this.addPromptTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_TRIAL',
          payload: {
            object: trialObject,
            response: 'Prompt',
            promptId: promptObject.id,
            note,
          },
        })

        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addPromptTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_CORRECT',
          payload: {
            response: 'Prompt',
            promptId: promptObject.id,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  removeCount = (val, trialResponse) => {
    const { note } = this.state
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].target[Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].target[Count - 1]
        this.addInCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_TRIAL',
          payload: {
            object: trialObject,
            response: trialResponse,
            promptId: '',
            note,
          },
        })
        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addInCorrectTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_CORRECT',
          payload: {
            response: trialResponse,
            promptId: '',
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  moveToNextTrail = () => {
    const {
      dispatch,
      sessionrecording: { Count, CorrectCount, IncorrectCount, TargetResponse, TargetActiveId },
    } = this.props

    if (!(Count > CorrectCount + IncorrectCount)) {
      if (Count === CorrectCount + IncorrectCount) {
        // storing trial start time
        this.updateStartTrialClockTime()
        // reseting correct incorrect buttons style
        this.resetCorrectIncorrectButtonStyle()
        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
      } else {
        // Object already present

        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
        // show previous response
        const object = TargetResponse[TargetActiveId].target[Count]
        if (object.trial === 'CORRECT') {
          this.addCorrectTrailButtonStyle()
        }
        if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
          this.addInCorrectTrailButtonStyle()
        }
        if (object.trial === 'PROMPT') {
          this.addPromptTrailButtonStyle()
        }
        this.setNoteText(object)
      }
    }
  }

  moveToPrevTrail = () => {
    const {
      dispatch,
      sessionrecording: { Count, TargetResponse, TargetActiveId },
    } = this.props
    this.resetCorrectIncorrectButtonStyle()
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Count: Count - 1,
      },
    })
    // show previous response
    const object = TargetResponse[TargetActiveId].target[Count - 2]
    if (object.trial === 'CORRECT') {
      this.addCorrectTrailButtonStyle()
    }
    if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
      this.addInCorrectTrailButtonStyle()
    }
    if (object.trial === 'PROMPT') {
      this.addPromptTrailButtonStyle()
    }
    this.setNoteText(object)
  }

  // Start of Stimulus functions

  moveToNextStimulus = () => {
    // storing trial start time
    this.updateStartTrialClockTime()
    this.resetCorrectIncorrectButtonStyle()
    const {
      dispatch,
      sessionrecording: {
        Count,
        StimulusActiveIndex,
        TargetActiveId,
        MasterSession,
        TargetActiveIndex,
      },
    } = this.props

    dispatch({
      type: 'sessionrecording/CHANGE_STIMULUS',
      payload: {
        stimulusId:
          MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[StimulusActiveIndex + 1].node
            .id,
        stimulusIndex: StimulusActiveIndex + 1,
        targetId: TargetActiveId,
      },
    })
  }

  moveToPrevStimulus = () => {
    // storing trial start time
    this.updateStartTrialClockTime()
    this.resetCorrectIncorrectButtonStyle()
    const {
      dispatch,
      sessionrecording: {
        Count,
        StimulusActiveIndex,
        TargetActiveId,
        MasterSession,
        TargetActiveIndex,
      },
    } = this.props

    dispatch({
      type: 'sessionrecording/CHANGE_STIMULUS',
      payload: {
        stimulusId:
          MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[StimulusActiveIndex - 1].node
            .id,
        stimulusIndex: StimulusActiveIndex - 1,
        targetId: TargetActiveId,
      },
    })
  }

  moveToNextSDTrail = () => {
    console.log('called move to next sd trial')
    const {
      dispatch,
      sessionrecording: {
        Count,
        CorrectCount,
        IncorrectCount,
        TargetResponse,
        TargetActiveId,
        StimulusActiveId,
      },
    } = this.props

    if (!(Count > CorrectCount + IncorrectCount)) {
      if (Count === CorrectCount + IncorrectCount) {
        // user want to perform new trial
        // storing trial start time
        this.updateStartTrialClockTime()
        // reseting correct incorrect buttons style
        this.resetCorrectIncorrectButtonStyle()
        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
      } else {
        // user updation existing trial
        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
        // show previous response
        const object = TargetResponse[TargetActiveId].sd[StimulusActiveId][Count]
        if (object.trial === 'CORRECT') {
          this.addCorrectTrailButtonStyle()
        }
        if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
          this.addInCorrectTrailButtonStyle()
        }
        if (object.trial === 'PROMPT') {
          this.addPromptTrailButtonStyle()
        }
        this.setNoteText(object)
      }
    }
  }

  moveToPrevSDTrail = () => {
    const {
      dispatch,
      sessionrecording: { Count, TargetResponse, TargetActiveId, StimulusActiveId },
    } = this.props
    this.resetCorrectIncorrectButtonStyle()
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Count: Count - 1,
      },
    })
    // show previous response
    const object = TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 2]
    if (object.trial === 'CORRECT') {
      this.addCorrectTrailButtonStyle()
    }
    if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
      this.addInCorrectTrailButtonStyle()
    }
    if (object.trial === 'PROMPT') {
      this.addPromptTrailButtonStyle()
    }
    this.setNoteText(object)
  }

  addSDCount = val => {
    const { note } = this.state
    const {
      dispatch,
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        Count,
        IncorrectCount,
        CorrectCount,
        StimulusActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]
        this.addCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_SD_TRIAL',
          payload: {
            object: trialObject,
            response: 'Correct',
            promptId: '',
            note,
          },
        })

        if (!(trialObject.trial === 'CORRECT')) {
          console.log('entred')
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount - 1,
              CorrectCount: CorrectCount + 1,
            },
          })
        }
      } else {
        this.addCorrectTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_SD_CORRECT',
          payload: {
            response: 'Correct',
            promptId: '',
            sdId: StimulusActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
    // this.trialAutoMove('sd')
  }

  promptSDCount = (val, promptObject) => {
    const { note } = this.state
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        StimulusActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]
        this.addPromptTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_SD_TRIAL',
          payload: {
            object: trialObject,
            response: 'Prompt',
            promptId: promptObject.id,
            note,
          },
        })

        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addPromptTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_SD_CORRECT',
          payload: {
            response: 'Prompt',
            promptId: promptObject.id,
            sdId: StimulusActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  removeSDCount = (val, trialResponse) => {
    const { note } = this.state
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        StimulusActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].sd[StimulusActiveId][Count - 1]
        this.addInCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_SD_TRIAL',
          payload: {
            object: trialObject,
            response: trialResponse,
            promptId: '',
            note,
          },
        })
        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addInCorrectTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_SD_CORRECT',
          payload: {
            response: trialResponse,
            promptId: '',
            sdId: StimulusActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  // End of Stimulus functions

  // Start of Step functions

  moveToNextStep = () => {
    // storing trial start time
    this.updateStartTrialClockTime()
    this.resetCorrectIncorrectButtonStyle()
    const {
      dispatch,
      sessionrecording: {
        Count,
        StepActiveIndex,
        TargetActiveId,
        MasterSession,
        TargetActiveIndex,
      },
    } = this.props

    dispatch({
      type: 'sessionrecording/CHANGE_STEP',
      payload: {
        stepId:
          MasterSession.targets.edges[TargetActiveIndex].node.steps.edges[StepActiveIndex + 1].node
            .id,
        stepIndex: StepActiveIndex + 1,
        targetId: TargetActiveId,
      },
    })
  }

  moveToPrevStep = () => {
    // storing trial start time
    this.updateStartTrialClockTime()
    this.resetCorrectIncorrectButtonStyle()
    const {
      dispatch,
      sessionrecording: {
        Count,
        StepActiveIndex,
        TargetActiveId,
        MasterSession,
        TargetActiveIndex,
      },
    } = this.props

    dispatch({
      type: 'sessionrecording/CHANGE_STEP',
      payload: {
        stepId:
          MasterSession.targets.edges[TargetActiveIndex].node.steps.edges[StepActiveIndex - 1].node
            .id,
        stepIndex: StepActiveIndex - 1,
        targetId: TargetActiveId,
      },
    })
  }

  moveToNextSTEPTrail = () => {
    const {
      dispatch,
      sessionrecording: {
        Count,
        CorrectCount,
        IncorrectCount,
        TargetResponse,
        TargetActiveId,
        StepActiveId,
      },
    } = this.props

    if (!(Count > CorrectCount + IncorrectCount)) {
      if (Count === CorrectCount + IncorrectCount) {
        // user want to perform new trial
        // storing trial start time
        this.updateStartTrialClockTime()
        // reseting correct incorrect buttons style
        this.resetCorrectIncorrectButtonStyle()
        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
      } else {
        // user updation existing trial
        // increasing Trial Count
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            Count: Count + 1,
          },
        })
        // show previous response
        const object = TargetResponse[TargetActiveId].step[StepActiveId][Count]
        if (object.trial === 'CORRECT') {
          this.addCorrectTrailButtonStyle()
        }
        if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
          this.addInCorrectTrailButtonStyle()
        }
        if (object.trial === 'PROMPT') {
          this.addPromptTrailButtonStyle()
        }
        this.setNoteText(object)
      }
    }
  }

  moveToPrevSTEPTrail = () => {
    const {
      dispatch,
      sessionrecording: { Count, TargetResponse, TargetActiveId, StepActiveId },
    } = this.props
    this.resetCorrectIncorrectButtonStyle()
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Count: Count - 1,
      },
    })
    // show previous response
    const object = TargetResponse[TargetActiveId].step[StepActiveId][Count - 2]
    if (object.trial === 'CORRECT') {
      this.addCorrectTrailButtonStyle()
    }
    if (object.trial === 'ERROR' || object.trial === 'INCORRECT') {
      this.addInCorrectTrailButtonStyle()
    }
    if (object.trial === 'PROMPT') {
      this.addPromptTrailButtonStyle()
    }

    this.setNoteText(object)
  }

  addSTEPCount = val => {
    const { note } = this.state
    const {
      dispatch,
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        Count,
        IncorrectCount,
        CorrectCount,
        StepActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]
        this.addCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_STEP_TRIAL',
          payload: {
            object: trialObject,
            response: 'Correct',
            promptId: '',
            note,
          },
        })

        if (!(trialObject.trial === 'CORRECT')) {
          console.log('entred')
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount - 1,
              CorrectCount: CorrectCount + 1,
            },
          })
        }
      } else {
        this.addCorrectTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_STEP_CORRECT',
          payload: {
            response: 'Correct',
            promptId: '',
            stepId: StepActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  promptSTEPCount = (val, promptObject) => {
    const { note } = this.state
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        StepActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]
        this.addPromptTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_STEP_TRIAL',
          payload: {
            object: trialObject,
            response: 'Prompt',
            promptId: promptObject.id,
            note,
          },
        })

        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addPromptTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_STEP_CORRECT',
          payload: {
            response: 'Prompt',
            promptId: promptObject.id,
            stepId: StepActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  removeSTEPCount = (val, trialResponse) => {
    const { note } = this.state
    this.closePromptOptions()
    const {
      dispatch,
      sessionrecording: {
        TargetActiveId,
        TargetResponse,
        Count,
        IncorrectCount,
        CorrectCount,
        StepActiveId,
        EditAfterSessionCompleted,
      },
    } = this.props

    if (EditAfterSessionCompleted) {
      if (TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]) {
        const trialObject = TargetResponse[TargetActiveId].step[StepActiveId][Count - 1]
        this.addInCorrectTrailButtonStyle()
        dispatch({
          type: 'sessionrecording/UPDATE_TARGET_STEP_TRIAL',
          payload: {
            object: trialObject,
            response: trialResponse,
            promptId: '',
            note,
          },
        })
        if (trialObject.trial === 'CORRECT') {
          dispatch({
            type: 'sessionrecording/SET_STATE',
            payload: {
              IncorrectCount: IncorrectCount + 1,
              CorrectCount: CorrectCount - 1,
            },
          })
        }
      } else {
        this.addInCorrectTrail(val)
        this.updateSessionClockTime()

        dispatch({
          type: 'sessionrecording/TARGET_STEP_CORRECT',
          payload: {
            response: trialResponse,
            promptId: '',
            stepId: StepActiveId,
            note,
          },
        })
      }
    }
    this.resetNote()
  }

  // End of Stimulus functions

  render() {
    const {
      sessionrecording: {
        loading,
        MasterSession,
        TargetActiveIndex,
        StepActiveIndex,
        StimulusActiveIndex,
        PromptCodesList,
        Count,
        CorrectCount,
        IncorrectCount,
        ResponseLoading,
      },
    } = this.props
    const { showPromptOptions, note } = this.state

    const correctIncorrectDiv = showPromptOptions
      ? { display: 'block', textAlign: 'center', marginTop: '20px' }
      : { display: 'none' }
    const promptOptionsDiv = showPromptOptions
      ? { display: 'none' }
      : {
        display: 'block',
        textAlign: 'center',
        margin: '40px auto',
        boxShadow: '0px 0px 5px #ccc',
        border: '1px solid #ccc',
        width: '700px',
        paddingBottom: '20px',
      }
    const promptCodeButtonStyle = {
      padding: '8px auto',
      width: '300px',
      height: '50px',
      marginTop: '10px',
    }
    const trialsLeftButtonStyle = {
      marginLeft: 5,
      marginRight: 5,

    }
    const trialsRightButtonStyle = {
      marginLeft: 5,
      marginRight: 5,

    }

    return (
      <>

        {MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length > 0 ? (
          <>
            {/* Start of Stimulus data recording section */}
            <Row>
              <Col span={24}>
                {/* Start of Stimulus count and description section */}
                <div style={{ textAlign: 'center', backgroundColor: '#fafafa', padding: 5 }}>
                  <Title level={4} style={{ display: 'inline-block' }}>
                    {
                      MasterSession.targets.edges[TargetActiveIndex].node.sd.edges[
                        StimulusActiveIndex
                      ].node.sd
                    }
                  </Title>
                  <span style={{ float: 'right', display: 'inline-block' }}>
                    {StimulusActiveIndex === 0 ? (
                      <Button style={trialsLeftButtonStyle} disabled>
                        <Icon type="left" />
                      </Button>
                    ) : (
                        <Button style={trialsLeftButtonStyle} onClick={this.moveToPrevStimulus}>
                          <Icon type="left" />
                        </Button>
                      )}


                    Stimulus {StimulusActiveIndex + 1} /{' '}
                    {MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length}

                    {StimulusActiveIndex ===
                      MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length - 1 ? (
                        <Button style={trialsRightButtonStyle} disabled>
                          <Icon type="right" />
                        </Button>
                      ) : (
                        <Button style={trialsRightButtonStyle} onClick={this.moveToNextStimulus}>
                          <Icon type="right" />
                        </Button>
                      )}
                  </span>
                </div>
                {/* Trials count section */}
                <div style={{ padding: 5 }}>
                  <NormalTargetScoreBoard />
                  <span style={{ float: 'right', display: 'inline-block' }}>
                    {Count === 1 ? (
                      <Button style={trialsLeftButtonStyle} disabled>
                        <Icon type="left" />
                      </Button>
                    ) : (
                        <Button style={trialsLeftButtonStyle} onClick={this.moveToPrevSDTrail}>
                          <Icon type="left" />
                        </Button>
                      )}

                    Trial {Count} /{' '}
                    {MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.DailyTrials}

                    {Count === MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails.DailyTrials ? (
                      <Button style={trialsRightButtonStyle} disabled>
                        <Icon type="right" />
                      </Button>
                    ) : (
                        <Button style={trialsRightButtonStyle} onClick={this.moveToNextSDTrail}>
                          <Icon type="right" />
                        </Button>
                      )}
                  </span>
                </div>
                {/* End of Trials count section */}
                {/* Correct Incorrect Buttons */}
                {ResponseLoading ?
                  <LoadingComponent />
                  :
                  <>
                    <p style={correctIncorrectDiv}>
                      <>
                        <Button
                          id="correctResponseButton"
                          style={{ padding: '20px auto', width: '300px', height: '50px' }}
                          onClick={() => this.addSDCount(Count)}
                        >
                          <CheckOutlined /> Correct ({CorrectCount})
                      </Button>
                        <Button
                          id="incorrectResponseButton"
                          style={{
                            padding: '8px auto',
                            width: '300px',
                            height: '50px',
                            marginTop: '10px',
                          }}
                          onClick={() => this.showPrompt()}
                        >
                          <CloseOutlined /> Incorrect ({IncorrectCount})
                      </Button>{' '}
                        <br />
                      </>

                    </p>
                    <p style={promptOptionsDiv}>
                      <div style={{ display: 'block', float: 'right', width: '100%' }}>
                        <Button
                          type="danger"
                          shape="circle"
                          icon="close"
                          onClick={() => this.closePromptOptions()}
                          style={{ float: 'right', margin: '3px 3px 0px 0px' }}
                        />
                      </div>
                      {PromptCodesList.map(item => (
                        <>
                          <Popconfirm
                            title={
                              <Input.TextArea
                                rows={4}
                                value={note}
                                onChange={e => this.setState({ note: e.target.value })}
                              />
                            }
                            icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                            onConfirm={() => this.promptSDCount(Count, item)}
                          >
                            <Button style={promptCodeButtonStyle}>{item.promptName}</Button>
                          </Popconfirm>


                        </>
                      ))}
                      <Popconfirm
                        title={
                          <Input.TextArea
                            rows={4}
                            value={note}
                            onChange={e => this.setState({ note: e.target.value })}
                          />
                        }
                        icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                        onConfirm={() => this.removeSDCount(Count, error)}
                      >
                        <Button style={promptCodeButtonStyle}>No Response</Button>
                      </Popconfirm>

                      <Popconfirm
                        title={
                          <Input.TextArea
                            rows={4}
                            value={note}
                            onChange={e => this.setState({ note: e.target.value })}
                          />
                        }
                        icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                        onConfirm={() => this.removeSDCount(Count, incorrect)}
                      >
                        <Button style={promptCodeButtonStyle}>Incorrect Response</Button>
                      </Popconfirm>
                    </p>
                  </>
                }
                {/* End of Correct Incorrect Buttons */}
              </Col>
            </Row>

            {/* End of Stimulus data recording section */}
          </>
        ) : MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.length > 0 ? (
          <>
            {/* Start of Step data recording section */}
            {/* Start of Step count and description section */}
            <Row>
              <Col span={24}>
                <div style={{ textAlign: 'center', backgroundColor: '#fafafa', padding: 5 }}>
                  <Title level={4} style={{ display: 'inline-block' }}>
                    {
                      MasterSession.targets.edges[TargetActiveIndex].node.steps.edges[StepActiveIndex]
                        .node.step
                    }
                  </Title>

                  <span style={{ float: 'right', display: 'inline-block' }}>
                    {StepActiveIndex === 0 ? (
                      <Button style={trialsLeftButtonStyle} disabled>
                        <Icon type="left" />
                      </Button>
                    ) : (
                        <Button
                          style={trialsLeftButtonStyle}
                          onClick={this.moveToPrevStep}

                        >
                          <Icon type="left" />
                        </Button>
                      )}

                    Step {StepActiveIndex + 1} /{' '}
                    {MasterSession.targets.edges[TargetActiveIndex].node.steps.edges.length}

                    {StepActiveIndex ===
                      MasterSession.targets.edges[TargetActiveIndex].node.sd.edges.length - 1 ? (
                        <Button style={trialsRightButtonStyle} disabled>
                          <Icon type="right" />
                        </Button>
                      ) : (
                        <Button
                          style={trialsRightButtonStyle}
                          onClick={this.moveToNextStep}

                        >
                          <Icon type="right" />
                        </Button>
                      )}
                  </span>
                </div>
                {/* End of Step count and description section */}
                {/* Trials count section */}

                <div style={{ padding: 5 }}>
                  <NormalTargetScoreBoard />
                  <span style={{ float: 'right', display: 'inline-block' }}>
                    {Count === 1 ? (
                      <Button style={trialsLeftButtonStyle} disabled>
                        <Icon type="left" />
                      </Button>
                    ) : (
                        <Button
                          style={trialsLeftButtonStyle}
                          onClick={this.moveToPrevSTEPTrail}

                        >
                          <Icon type="left" />
                        </Button>
                      )}

                    Trial {Count} /{' '}
                    {
                      MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                        .DailyTrials
                    }

                    {Count ===
                      MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                        .DailyTrials ? (
                        <Button style={trialsRightButtonStyle} disabled>
                          <Icon type="right" />
                        </Button>
                      ) : (
                        <Button
                          style={trialsRightButtonStyle}
                          onClick={this.moveToNextSTEPTrail}

                        >
                          <Icon type="right" />
                        </Button>
                      )}
                  </span>
                </div>
                {/* End of Trials count section */}
                {/* Correct Incorrect Buttons */}
                {ResponseLoading ?
                  <LoadingComponent />
                  :
                  <>
                    <p style={correctIncorrectDiv}>

                      <>
                        <Button
                          id="correctResponseButton"
                          style={{ padding: '20px auto', width: '300px', height: '50px' }}
                          onClick={() => this.addSTEPCount(Count)}
                        >
                          <CheckOutlined /> Correct ({CorrectCount})
                      </Button>
                        <Button
                          id="incorrectResponseButton"
                          style={{
                            padding: '8px auto',
                            width: '300px',
                            height: '50px',
                            marginTop: '10px',
                          }}
                          onClick={() => this.showPrompt()}
                        >
                          <CloseOutlined /> Incorrect ({IncorrectCount})
                      </Button>{' '}
                        <br />
                      </>

                    </p>
                    <p style={promptOptionsDiv}>
                      <div style={{ display: 'block', float: 'right', width: '100%' }}>
                        <Button
                          type="danger"
                          shape="circle"
                          icon="close"
                          onClick={() => this.closePromptOptions()}
                          style={{ float: 'right', margin: '3px 3px 0px 0px' }}
                        />
                      </div>
                      {PromptCodesList.map(item => (
                        <>
                          <Popconfirm
                            title={
                              <Input.TextArea
                                rows={4}
                                value={note}
                                onChange={e => this.setState({ note: e.target.value })}
                              />
                            }
                            icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                            onConfirm={() => this.promptSTEPCount(Count, item)}
                          >
                            <Button style={promptCodeButtonStyle}>{item.promptName}</Button>
                          </Popconfirm>


                        </>
                      ))}
                      <Popconfirm
                        title={
                          <Input.TextArea
                            rows={4}
                            value={note}
                            onChange={e => this.setState({ note: e.target.value })}
                          />
                        }
                        icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                        onConfirm={() => this.removeSTEPCount(Count, error)}
                      >
                        <Button style={promptCodeButtonStyle}>No Response</Button>
                      </Popconfirm>
                      <Popconfirm
                        title={
                          <Input.TextArea
                            rows={4}
                            value={note}
                            onChange={e => this.setState({ note: e.target.value })}
                          />
                        }
                        icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                        onConfirm={() => this.removeSTEPCount(Count, incorrect)}
                      >
                        <Button style={promptCodeButtonStyle}>Incorrect Response</Button>
                      </Popconfirm>
                    </p>
                  </>
                }
                {/* End of Correct Incorrect Buttons */}
                {/* End of Step data recording section */}

              </Col>
            </Row>
          </>
        ) : (
              <Row>
                <Col span={24}>
                  {/* Start of Target data recording */}
                  {/* Trials count section */}
                  <div style={{ padding: 5 }}>
                    <NormalTargetScoreBoard />
                    <span style={{ float: 'right', display: 'inline-block' }}>

                      {Count === 1 ? (
                        <Button style={trialsLeftButtonStyle} disabled>
                          <Icon type="left" />
                        </Button>
                      ) : (
                          <Button style={trialsLeftButtonStyle} onClick={this.moveToPrevTrail}>
                            <Icon type="left" />
                          </Button>
                        )}

                      Trial {Count} /{' '}
                      {
                        MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                          .DailyTrials
                      }

                      {Count ===
                        MasterSession.targets.edges[TargetActiveIndex].node.targetAllcatedDetails
                          .DailyTrials ? (
                          <Button style={trialsRightButtonStyle} disabled>
                            <Icon type="right" />
                          </Button>
                        ) : (
                          <Button style={trialsRightButtonStyle} onClick={this.moveToNextTrail}>
                            <Icon type="right" />
                          </Button>
                        )}
                    </span>
                  </div>
                  {/* End of Trials count section */}
                  {/* Correct Incorrect Buttons */}
                  {ResponseLoading ?
                    <LoadingComponent />
                    :
                    <>
                      <p style={correctIncorrectDiv}>

                        <>
                          <Button
                            id="correctResponseButton"
                            style={{ padding: '20px auto', width: '300px', height: '50px' }}
                            onClick={() => this.addCount(Count)}
                          >
                            <CheckOutlined /> Correct ({CorrectCount})
                        </Button>
                          <Button
                            id="incorrectResponseButton"
                            style={{
                              padding: '8px auto',
                              width: '300px',
                              height: '50px',
                              marginTop: '10px',
                            }}
                            onClick={() => this.showPrompt()}
                          >
                            <CloseOutlined /> Incorrect ({IncorrectCount})
                        </Button>{' '}
                          <br />
                        </>

                      </p>
                      <p style={promptOptionsDiv}>
                        <div style={{ display: 'block', float: 'right', width: '100%' }}>
                          <Button
                            type="danger"
                            shape="circle"
                            icon="close"
                            onClick={() => this.closePromptOptions()}
                            style={{ float: 'right', margin: '3px 3px 0px 0px' }}
                          />
                        </div>
                        {PromptCodesList.map(item => (
                          <>
                            <Popconfirm
                              title={
                                <Input.TextArea
                                  rows={4}
                                  value={note}
                                  onChange={e => this.setState({ note: e.target.value })}
                                />
                              }
                              icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                              onConfirm={() => this.promptCount(Count, item)}
                            >
                              <Button style={promptCodeButtonStyle}>{item.promptName}</Button>
                            </Popconfirm>


                          </>
                        ))}
                        <Popconfirm
                          title={
                            <Input.TextArea
                              rows={4}
                              value={note}
                              onChange={e => this.setState({ note: e.target.value })}
                            />
                          }
                          icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                          onConfirm={() => this.removeCount(Count, error)}
                        >
                          <Button style={promptCodeButtonStyle}>No Response</Button>
                        </Popconfirm>
                        <Popconfirm
                          title={
                            <Input.TextArea
                              rows={4}
                              value={note}
                              onChange={e => this.setState({ note: e.target.value })}
                            />
                          }
                          icon={<Icon type="question-circle-o" style={{ color: 'green' }} />}
                          onConfirm={() => this.removeCount(Count, incorrect)}
                        >
                          <Button style={promptCodeButtonStyle}>Incorrect Response</Button>
                        </Popconfirm>
                      </p>
                    </>
                  }
                  {/* End of Correct Incorrect Buttons */}
                  {/* End of Target data recording */}
                </Col>
              </Row>
            )}
      </>
    )
  }
}

export default DataRecordingBlock
