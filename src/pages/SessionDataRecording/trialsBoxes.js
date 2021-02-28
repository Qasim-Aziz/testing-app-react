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
/* eslint-disable react/jsx-closing-tag-location */

import React, { Component } from 'react'
import { Card, Progress, Typography, Button } from 'antd'
import { connect } from 'react-redux'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class TrialsList extends Component {

  showBlockTrail = (blockIndex, trailIndex) => {
    const {dispatch, sessionrecording: {TargetResponse, TargetActiveId }} = this.props
    if (TargetResponse[TargetActiveId].peak[blockIndex]?.block[trailIndex].recordedData){
      dispatch({
        type: 'sessionrecording/SET_STATE',
        payload: {
          PeakBlockIndex: blockIndex,
          PeakTrialCount: trailIndex + 1
        },
      })
      if (
        TargetResponse[TargetActiveId].peak[blockIndex].block[trailIndex].response
          .marks === 0
      ) {
        document.getElementById('peakResponseButtonZero').style.backgroundColor = '#FF8080'
      }
      if (
        TargetResponse[TargetActiveId].peak[blockIndex].block[trailIndex].response
          .marks === 2
      ) {
        document.getElementById('peakResponseButtonTwo').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[blockIndex].block[trailIndex].response
          .marks === 4
      ) {
        document.getElementById('peakResponseButtonFour').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[blockIndex].block[trailIndex].response
          .marks === 8
      ) {
        document.getElementById('peakResponseButtonEight').style.backgroundColor = '#FF9C52'
      }
      if (
        TargetResponse[TargetActiveId].peak[blockIndex].block[trailIndex].response
          .marks === 10
      ) {
        document.getElementById('peakResponseButtonTen').style.backgroundColor = '#4BAEA0'
      }
    }
  }

  getBlock = (j, trialsList) => {
    const {
      trails,
      boxWidth,
      boxHeight,
      sessionrecording: { TargetResponse, TargetActiveId },
    } = this.props
    const colorList = []

    for (let k = 0; k < trialsList.length; k++) {
      if (trialsList[k].response?.marks === 0) {
        colorList.push('#FF8080')
      } else if (
        trialsList[k].response?.marks === 2 ||
        trialsList[k].response?.marks === 4 ||
        trialsList[k].response?.marks === 8
      ) {
        colorList.push('#FF9C52')
      } else if (trialsList[k].response?.marks === 10) {
        colorList.push('#4BAEA0')
      } else {
        colorList.push('')
      }
    }

    const Trials = []
    for (let i = 0; i < trialsList.length; i++) {
      Trials.push(
        <Button style={{border: 'none', padding: 0}} onClick={() => this.showBlockTrail(j,i)}>
          <div
            style={{
              display: 'inline-block',
              marginRight: '8px',
              marginLeft: '8px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                height: boxHeight,
                display: 'inline-block',
                lineHeight: '12px',
                width: boxWidth,
                border: '1px solid black',
                backgroundColor: colorList[i] ? colorList[i] : '',
                paddingLeft: '20px',
                borderRadius: '2px',
                marginRight: '2px',
              }}
            >
              &nbsp;
          </span>
          </div>
        </Button>,
      )
    }
    return (
      <div style={{ padding: '10px' }}>
        Block {j + 1} : {Trials}
      </div>
    )
  }

  render() {
    const {
      trails,
      boxWidth,
      boxHeight,
      sessionrecording: {
        TargetResponse,
        TargetActiveId,
        MasterSession,
        TargetActiveIndex,
        PeakBlockIndex,
      },
    } = this.props

    const trialsList = TargetResponse[TargetActiveId].peak
    const blockCount = MasterSession.targets.edges[TargetActiveIndex].node.peakBlocks
    const Blocks = []
    for (let j = 0; j < blockCount; j++) {
      Blocks.push(this.getBlock(j, TargetResponse[TargetActiveId].peak[j].block))
    }

    return <>{Blocks}</>
  }
}
export default TrialsList
