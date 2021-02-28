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
import { Card, Progress, Typography } from 'antd'
import { connect } from 'react-redux'

@connect(({ sessionrecording }) => ({ sessionrecording }))
class TrialsList extends Component {
  render() {
    const {
      dailyTrails,
      boxWidth,
      id,
      sdKey,
      stepKey,
      sessionrecording: { TargetResponse },
    } = this.props
    let object = TargetResponse[id].target
    if (!(sdKey === '')) {
      object = TargetResponse[id].sd[sdKey]
    } else if (!(stepKey === '')) {
      object = TargetResponse[id].step[stepKey]
    }

    const colorList = []
    if (object.length > 0) {
      object.map(item => {
        if (item.trial === 'CORRECT') {
          colorList.push('#4BAEA0')
        }
        if (item.trial === 'ERROR') {
          colorList.push('#FF8080')
        }
        if (item.trial === 'INCORRECT') {
          colorList.push('#FF8080')
        }
        if (item.trial === 'PROMPT') {
          colorList.push('#FF9C52')
        }
      })
    }

    const Trials = []
    let i = 0
    for (i = 0; i < dailyTrails; i++) {
      Trials.push(
        <span
          // className={'trial_'+id+'_'+i}
          style={{
            height: '15px',
            display: 'inline-block',
            lineHeight: '12px',
            width: boxWidth,
            border: '1px solid #999999',
            backgroundColor: colorList[i] ? colorList[i] : '',
            paddingLeft: '20px',
            borderRadius: '2px',
            marginRight: '5px',
          }}
        >
          &nbsp;
        </span>,
      )
    }

    return <>{Trials}</>
  }
}
export default TrialsList
