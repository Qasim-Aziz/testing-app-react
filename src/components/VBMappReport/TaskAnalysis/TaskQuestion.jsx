import React from 'react'
import { Tooltip } from 'antd'
import _ from 'lodash'
import taskCodeDetails from './taskCodeDetails'

const TaskQuestion = ({ index, question, groupName }) => {
  const getTooltip = (queNo, code, testName) => (
    <div>
      <div>
        <b>Que: </b>
        {queNo}
      </div>
      <div>
        <b>Test: </b>
        {testName}
      </div>
      <div>
        <b>Code: </b>
        {code}
      </div>
    </div>
  )

  const notSelectedOptionRange = 13 - taskCodeDetails[groupName][index].length
  const notSelectedSpace = _.range(0, notSelectedOptionRange, 1)
  const renderBlankBoxes = notSelectedSpace.map(i => (
    <div key={i} className="blankCode">
      &nbsp;
    </div>
  ))

  if (!question) {
    return (
      <div className="question">
        <div className="queNo">{`Que - ${index}`}</div>
        {taskCodeDetails[groupName][index].map(code => (
          <div key={code} className="notSelectedCode">
            {code}
          </div>
        ))}
        {renderBlankBoxes}
      </div>
    )
  }

  return (
    <div className="question">
      <div className="queNo">{`Que - ${question.questionNum}`}</div>
      {taskCodeDetails[groupName][question.questionNum].map(code => {
        const codeDetails = question.codes[code]
        if (codeDetails) {
          return (
            <Tooltip
              key={`${codeDetails.code}-${codeDetails.testName}`}
              placement="top"
              title={getTooltip(question.questionNum, codeDetails.code, codeDetails.testName)}
            >
              <div className="selectedCode" style={{ backgroundColor: codeDetails.color }}>
                {codeDetails.code}
              </div>
            </Tooltip>
          )
        }

        // If not selected then just add value
        return (
          <div key={`${question.questionNum}-${code}`} className="notSelectedCode">
            {code}
          </div>
        )
      })}
      {renderBlankBoxes}
    </div>
  )
}

export default TaskQuestion
