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
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-useless-concat */
/* eslint-disable consistent-return */

import React, { Component } from 'react'
import { Card, Tabs, Typography, Button, Icon, notification, Radio, Collapse } from 'antd'
import { connect } from 'react-redux'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Panel } = Collapse
const recordingButtonStyle = {
  padding: '8px auto',
  width: '70px',
  height: '50px',
  marginTop: '10px',
  marginLeft: '5px',
  marginRight: '5px',
  backgroundColor: '#e4e9f0',
}

@connect(({ sessionrecording }) => ({ sessionrecording }))
class RecordingBlock extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // SelectedOperation: 'Train'
    }
  }

  componentDidMount() {
    const {
      dispatch,
      sessionrecording: { MasterSession, TargetActiveIndex },
    } = this.props

    dispatch({
      type: 'sessionrecording/GET_SD_COMBINATIONS',
      payload: {
        code: MasterSession.targets.edges[TargetActiveIndex].node.eqCode
          ? MasterSession.targets.edges[TargetActiveIndex].node.eqCode
          : '1A',
      },
    })

    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        SelectedOperation: 'Train',
        SelectedClassId:
          MasterSession.targets.edges[TargetActiveIndex].node.classes.edges[0]?.node.id,
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
    const getButton0 = document.getElementById('peakResponseButtonZero')
    if (typeof getButton0 != 'undefined' && getButton0 != null) {
      document.getElementById('peakResponseButtonZero').style.color = 'gray'
      document.getElementById('peakResponseButtonZero').style.backgroundColor = '#e4e9f0'
    }
  }

  resetTwo = () => {
    const getButton2 = document.getElementById('peakResponseButtonTwo')
    if (typeof getButton2 != 'undefined' && getButton2 != null) {
      document.getElementById('peakResponseButtonTwo').style.color = 'gray'
      document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#e4e9f0'
    }
  }

  resetFour = () => {
    const getButton4 = document.getElementById('peakResponseButtonFour')
    if (typeof getButton4 != 'undefined' && getButton4 != null) {
      document.getElementById('peakResponseButtonFour').style.color = 'gray'
      document.getElementById('peakResponseButtonFour').style.backgroundColor = '#e4e9f0'
    }
  }

  resetEight = () => {
    const getButton8 = document.getElementById('peakResponseButtonEight')
    if (typeof getButton8 != 'undefined' && getButton8 != null) {
      document.getElementById('peakResponseButtonEight').style.color = 'gray'
      document.getElementById('peakResponseButtonEight').style.backgroundColor = '#e4e9f0'
    }
  }

  resetTen = () => {
    const getButton10 = document.getElementById('peakResponseButtonTen')
    if (typeof getButton10 != 'undefined' && getButton10 != null) {
      document.getElementById('peakResponseButtonTen').style.color = 'gray'
      document.getElementById('peakResponseButtonTen').style.backgroundColor = '#e4e9f0'
    }
  }

  goToNextTrial = () => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        ActiveCombination,
        TargetActiveId,
        TargetResponse,
        EquiTrialCount,
        SelectedClassId,
        SelectedOperation,
      },
    } = this.props

    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (EquiTrialCount < 10) {
      if (
        EquiTrialCount <=
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId].length
      ) {
        this.updateStartTrialClockTime()
        dispatch({
          type: 'sessionrecording/SET_STATE',
          payload: {
            EquiTrialCount: EquiTrialCount + 1,
          },
        })

        // setting button color
        if (
          TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
            EquiTrialCount
          ]?.score === 0
        ) {
          document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
        }
        if (
          TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
            EquiTrialCount
          ]?.score === 2
        ) {
          document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
            EquiTrialCount
          ]?.score === 4
        ) {
          document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
            EquiTrialCount
          ]?.score === 8
        ) {
          document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
        }
        if (
          TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
            EquiTrialCount
          ]?.score === 10
        ) {
          document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
        }
      } else {
        notification.warning({
          message: 'Warning!!',
          description: 'Record ' + EquiTrialCount + ' Trial first',
        })
      }
    }
  }

  goToPreviousTrial = () => {
    const {
      dispatch,
      sessionrecording: {
        ActiveCombination,
        TargetActiveId,
        TargetResponse,
        EquiTrialCount,
        SelectedClassId,
        SelectedOperation,
      },
    } = this.props

    if (EquiTrialCount > 1) {
      this.resetZero()
      this.resetTwo()
      this.resetFour()
      this.resetEight()
      this.resetTen()

      this.updateStartTrialClockTime()

      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          EquiTrialCount: EquiTrialCount - 1,
        },
      })

      let text = 'train'
      if (SelectedOperation === 'Test') text = 'test'

      // setting button color
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
          EquiTrialCount - 2
        ]?.score === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
          EquiTrialCount - 2
        ]?.score === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
          EquiTrialCount - 2
        ]?.score === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
          EquiTrialCount - 2
        ]?.score === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][
          EquiTrialCount - 2
        ]?.score === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
  }

  responseZero = combId => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
      },
    } = this.props
    this.updateSessionClockTime()
    document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length <
      EquiTrialCount
    ) {
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 0,
        },
      })
    } else {
      console.log('Update')
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 0,
          trialRecordedId:
            TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][
              EquiTrialCount - 1
            ]?.id,
        },
      })
    }
  }

  responseTwo = combId => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
      },
    } = this.props
    this.updateSessionClockTime()
    document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'

    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length <
      EquiTrialCount
    ) {
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 2,
        },
      })
    } else {
      console.log('Update')
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 2,
          trialRecordedId:
            TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][
              EquiTrialCount - 1
            ]?.id,
        },
      })
    }
  }

  responseFour = combId => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
      },
    } = this.props
    this.updateSessionClockTime()
    document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length <
      EquiTrialCount
    ) {
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 4,
        },
      })
    } else {
      console.log('Update')
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 4,
          trialRecordedId:
            TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][
              EquiTrialCount - 1
            ]?.id,
        },
      })
    }
  }

  responseEight = combId => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
      },
    } = this.props
    this.updateSessionClockTime()
    document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length <
      EquiTrialCount
    ) {
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 8,
        },
      })
    } else {
      console.log('Update')
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 8,
          trialRecordedId:
            TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][
              EquiTrialCount - 1
            ]?.id,
        },
      })
    }
  }

  responseTen = combId => {
    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()

    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
      },
    } = this.props
    this.updateSessionClockTime()
    document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'

    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    if (
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length <
      EquiTrialCount
    ) {
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 10,
        },
      })
    } else {
      console.log('Update')
      dispatch({
        type: 'sessionrecording/EQUIVALENCE_RESPONSE_UPDATE',
        payload: {
          operation: SelectedOperation,
          classId: SelectedClassId,
          combinationTest: SelectedOperation === 'Test' ? combId : '',
          combinationTrain: SelectedOperation === 'Train' ? combId : '',
          response: 10,
          trialRecordedId:
            TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][
              EquiTrialCount - 1
            ]?.id,
        },
      })
    }
  }

  callback = e => {
    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
        ActiveCombination,
      },
    } = this.props

    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    this.updateStartTrialClockTime()

    let text = 'train'
    if (SelectedOperation === 'Test') text = 'test'

    const trialsLength =
      TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][e].length
    if (trialsLength < 10) {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedClassId: e,
          EquiTrialCount: trialsLength + 1,
        },
      })
    } else {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedClassId: e,
          EquiTrialCount: 10,
        },
      })

      // setting button color
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][9]
          ?.score === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][9]
          ?.score === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][9]
          ?.score === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][9]
          ?.score === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][ActiveCombination][SelectedClassId][9]
          ?.score === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
  }

  chnageOperation = type => {
    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
        ActiveCombination,
        SdCombinations,
      },
    } = this.props

    let text = 'train'
    let comId = ''
    if (type === 'Test') {
      text = 'test'
      comId = SdCombinations.test.edges[0]?.node.id
    } else {
      comId = SdCombinations.train.edges[0]?.node.id
    }

    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    this.updateStartTrialClockTime()

    console.log(
      TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId],
      'length parent',
    )
    const trialsLength =
      TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId]?.length
    if (trialsLength < 10) {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedOperation: type,
          EquiTrialCount: trialsLength + 1,
          ActiveCombination: comId,
        },
      })
    } else {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          SelectedOperation: type,
          EquiTrialCount: 10,
          ActiveCombination: comId,
        },
      })

      // setting button color
      if (
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId] &&
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId][9]?.score === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId] &&
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId][9]?.score === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId] &&
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId][9]?.score === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId] &&
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId][9]?.score === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId] &&
        TargetResponse[TargetActiveId].equivalence[text][comId][SelectedClassId][9]?.score === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
  }

  changeCombination = combId => {
    const {
      dispatch,
      sessionrecording: {
        SelectedClassId,
        SelectedOperation,
        TargetResponse,
        TargetActiveId,
        EquiTrialCount,
        ActiveCombination,
        SdCombinations,
      },
    } = this.props

    let text = 'train'
    if (SelectedOperation === 'Test') {
      text = 'test'
    }

    this.resetZero()
    this.resetTwo()
    this.resetFour()
    this.resetEight()
    this.resetTen()
    this.updateStartTrialClockTime()

    console.log(SelectedClassId, SelectedOperation, TargetResponse, TargetActiveId, combId)

    const trialsLength =
      TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId].length
    if (trialsLength < 10) {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          EquiTrialCount: trialsLength + 1,
          ActiveCombination: combId,
        },
      })
    } else {
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          EquiTrialCount: 10,
          ActiveCombination: combId,
        },
      })

      // setting button color
      if (
        TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][9]?.score === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][9]?.score === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][9]?.score === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][9]?.score === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].equivalence[text][combId][SelectedClassId][9]?.score === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
  }

  getFullName = (nodeItem, stimulus) => {
    let finalText = ''
    nodeItem.node.stimuluses.edges.map(edgeNode => {
      if (edgeNode.node.option === stimulus) {
        finalText = edgeNode.node.stimulusName
      }
    })
    return finalText
  }

  getDescriptions = nodeItem => {
    const {
      sessionrecording: { SdCombinations, PeakTrialCount, SelectedOperation, EquiTrialCount },
    } = this.props

    if (SelectedOperation === 'Train') {
      const combinations = []
      SdCombinations?.train.edges.map((combinationNode, combinationIndex) => {
        combinations.push({
          id: combinationNode.node.id,
          relation:
            `${combinationNode.node.stimulus1} ` +
            `${combinationNode.node.sign12} ` +
            `${combinationNode.node.stimulus2} ` +
            `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` +
            `${combinationNode.node.stimulus3 ? combinationNode.node.stimulus3 : ''} `,
          description:
            `${this.getFullName(nodeItem, combinationNode.node.stimulus1)} ` +
            `${combinationNode.node.sign12} ` +
            `${this.getFullName(nodeItem, combinationNode.node.stimulus2)} ` +
            `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` +
            `${
              combinationNode.node.stimulus3
                ? this.getFullName(nodeItem, combinationNode.node.stimulus3)
                : ''
            } `,
        })
      })

      if (combinations.length > 0) {
        return (
          <div style={{ textAlign: 'center' }}>
            <Collapse
              accordion
              destroyInactivePanel={true}
              onChange={e => this.changeCombination(e)}
            >
              {combinations.map(item => (
                <Panel header={item.description} key={item.id} extra={item.relation}>
                  <div style={{ textAlign: 'center' }}>
                    <Button onClick={this.goToPreviousTrial}>
                      <Icon type="left" />
                    </Button>
                    &nbsp; Trial {EquiTrialCount} / 10 &nbsp;
                    <Button onClick={this.goToNextTrial}>
                      <Icon type="right" />
                    </Button>
                  </div>

                  <Button
                    id="peakResponseButtonZero"
                    style={recordingButtonStyle}
                    onClick={() => this.responseZero(item.id)}
                  >
                    0
                  </Button>
                  <Button
                    id="peakResponseButtonTwo"
                    style={recordingButtonStyle}
                    onClick={() => this.responseTwo(item.id)}
                  >
                    2
                  </Button>
                  <Button
                    id="peakResponseButtonFour"
                    style={recordingButtonStyle}
                    onClick={() => this.responseFour(item.id)}
                  >
                    4
                  </Button>
                  <Button
                    id="peakResponseButtonEight"
                    style={recordingButtonStyle}
                    onClick={() => this.responseEight(item.id)}
                  >
                    8
                  </Button>
                  <Button
                    id="peakResponseButtonTen"
                    style={recordingButtonStyle}
                    onClick={() => this.responseTen(item.id)}
                  >
                    10
                  </Button>
                </Panel>
              ))}
            </Collapse>
          </div>
        )
      }
    }

    if (SelectedOperation === 'Test') {
      const combinations = []
      SdCombinations?.test.edges.map((combinationNode, combinationIndex) => {
        combinations.push({
          id: combinationNode.node.id,
          relation:
            `${combinationNode.node.stimulus1} ` +
            `${combinationNode.node.sign12} ` +
            `${combinationNode.node.stimulus2} ` +
            `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` +
            `${combinationNode.node.stimulus3 ? combinationNode.node.stimulus3 : ''} `,
          description:
            `${this.getFullName(nodeItem, combinationNode.node.stimulus1)} ` +
            `${combinationNode.node.sign12} ` +
            `${this.getFullName(nodeItem, combinationNode.node.stimulus2)} ` +
            `${combinationNode.node.sign23 ? combinationNode.node.sign23 : ''} ` +
            `${
              combinationNode.node.stimulus3
                ? this.getFullName(nodeItem, combinationNode.node.stimulus3)
                : ''
            } `,
        })
      })

      if (combinations.length > 0) {
        return (
          <div style={{ textAlign: 'center' }}>
            <Collapse
              accordion
              destroyInactivePanel={true}
              onChange={e => this.changeCombination(e)}
            >
              {combinations.map(item => (
                <Panel header={item.description} key={item.id} extra={item.relation}>
                  <div style={{ textAlign: 'center' }}>
                    <Button onClick={this.goToPreviousTrial}>
                      <Icon type="left" />
                    </Button>
                    &nbsp; Trial {EquiTrialCount} / 10 &nbsp;
                    <Button onClick={this.goToNextTrial}>
                      <Icon type="right" />
                    </Button>
                  </div>

                  <Button
                    id="peakResponseButtonZero"
                    style={recordingButtonStyle}
                    onClick={() => this.responseZero(item.id)}
                  >
                    0
                  </Button>
                  <Button
                    id="peakResponseButtonTwo"
                    style={recordingButtonStyle}
                    onClick={() => this.responseTwo(item.id)}
                  >
                    2
                  </Button>
                  <Button
                    id="peakResponseButtonFour"
                    style={recordingButtonStyle}
                    onClick={() => this.responseFour(item.id)}
                  >
                    4
                  </Button>
                  <Button
                    id="peakResponseButtonEight"
                    style={recordingButtonStyle}
                    onClick={() => this.responseEight(item.id)}
                  >
                    8
                  </Button>
                  <Button
                    id="peakResponseButtonTen"
                    style={recordingButtonStyle}
                    onClick={() => this.responseTen(item.id)}
                  >
                    10
                  </Button>
                </Panel>
              ))}
            </Collapse>
          </div>
        )
      }
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
        SelectedOperation,
      },
    } = this.props

    return (
      <>
        <div style={{ padding: '10px' }}>
          <div style={{ display: 'block', marginBottom: '5px' }}>
            <span style={{ float: 'right' }}>
              Code :{' '}
              {MasterSession.targets.edges[TargetActiveIndex].node.eqCode
                ? MasterSession.targets.edges[TargetActiveIndex].node.eqCode
                : 'N/A'}
            </span>

            <Radio.Group
              value={SelectedOperation}
              onChange={e => this.chnageOperation(e.target.value)}
              buttonStyle="solid"
              style={{ float: 'left' }}
            >
              <Radio.Button value="Train">Train</Radio.Button>
              <Radio.Button value="Test">Test</Radio.Button>
            </Radio.Group>
          </div>
          <br />
          <div style={{ display: 'block', marginTop: '10px' }}>
            <Tabs destroyInactiveTabPane={true} onChange={e => this.callback(e)}>
              {MasterSession.targets.edges[TargetActiveIndex].node.classes.edges.map(
                (nodeItem, nodeIndex) => (
                  <TabPane tab={nodeItem.node.name} key={nodeItem.node.id}>
                    {this.getDescriptions(nodeItem)}
                  </TabPane>
                ),
              )}
            </Tabs>
          </div>

          <br />
        </div>
      </>
    )
  }
}
export default RecordingBlock
