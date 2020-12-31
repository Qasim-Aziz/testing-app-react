/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-concat */
import React, { useEffect } from 'react'
import { Tooltip } from 'antd';

const scoreBoxStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 50,
  height: 40,
  border: '1px solid #3e7bfa',
  borderRadius: 2,
  marginRight: 10,
  fontSize: 20,
}

const scoreBoxContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

export default ({ questions }) => {
  console.log(questions)
  let assignment1 = { complete: 0, test: '' }
  let assignment2 = { complete: 0, test: '' }
  let assignment3 = { complete: 0, test: '' }
  let assignment4 = { complete: 0, test: '' }

  questions.forEach(({ previous_assess }) => {
    assignment1.complete += previous_assess[0]
      ? previous_assess[0].score.length === 0
        ? 0
        : parseFloat(previous_assess[0]?.score)
      : null
    assignment1.test = previous_assess[0] ? previous_assess[0].test_no : null
    assignment2.complete += previous_assess[1]
      ? previous_assess[1].score.length === 0
        ? 0
        : parseFloat(previous_assess[1]?.score)
      : null

    assignment2.test = previous_assess[1] ? previous_assess[1].test_no : null
    assignment3.complete += previous_assess[2]
      ? previous_assess[2].score.length === 0
        ? 0
        : parseFloat(previous_assess[2]?.score)
      : null
    assignment3.test = previous_assess[2] ? previous_assess[2].test_no : null
    assignment4.complete += previous_assess[3]
      ? previous_assess[3].score.length === 0
        ? 0
        : parseFloat(previous_assess[3]?.score)
      : null
    assignment4.test = previous_assess[3] ? previous_assess[3].test_no : null
  })

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <h4 style={{ marginRight: 10, marginTop: 10 }}>Last 4 Result :</h4>
      {assignment1.test && (
        <div style={scoreBoxContainerStyle}>
          <Tooltip placement="topLeft" title={`${assignment1.test}` + ` Assessment`}>
            <div style={scoreBoxStyle}>{assignment1.complete}</div>
          </Tooltip>
        </div>
      )}
      {assignment2.test && (
        <div style={scoreBoxContainerStyle}>
          <Tooltip placement="topLeft" title={`${assignment2.test}` + ` Assessment`}>
            <div style={scoreBoxStyle}>{assignment2.complete}</div>
          </Tooltip>
        </div>
      )}
      {assignment3.test && (
        <div style={scoreBoxContainerStyle}>
          <Tooltip placement="topLeft" title={`${assignment3.test}` + ` Assessment`}>
            <div style={scoreBoxStyle}>{assignment3.complete}</div>
          </Tooltip>
        </div>
      )}
      {assignment4.test && (
        <div style={scoreBoxContainerStyle}>
          <Tooltip placement="topLeft" title={`${assignment4.test}` + ` Assessment`}>
            <div style={scoreBoxStyle}>{assignment4.complete}</div>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
