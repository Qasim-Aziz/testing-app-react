import React from 'react'
import { Tooltip } from 'antd'
import _ from 'lodash'

const TransitionQuestion = ({ question, scoreDetails }) => {
  const getTooltip = (que, testNo) => (
    <div>
      <div>
        <b>Que: </b>
        {que.title}
      </div>
      <div>
        <b>Score: </b>
        {que[`test${testNo}`]}
      </div>
      <div>
        <b>Test: </b>
        {scoreDetails[testNo - 1].testTitle}
      </div>
    </div>
  )

  return (
    <div className="transitionQuestion">
      <div className="queTitle">{question.title}</div>
      <div className="scoreGroup">
        <div className="axisLine">
          {[5, 4, 3, 2, 1].map(axis => (
            <div key={axis} className="axisText">
              {axis}
            </div>
          ))}
        </div>
        {scoreDetails.map((testData, index) => {
          if (testData.testTitle) {
            // Display TOoltops if Test is given
            return (
              <Tooltip key={testData.key} placement="top" title={getTooltip(question, index + 1)}>
                {_.range(5, question[`test${index + 1}`], -1).map(i => (
                  <div key={i} className="score">
                    &nbsp;
                  </div>
                ))}
                {_.range(0, question[`test${index + 1}`], 1).map(i => (
                  <div key={i} className="score" style={{ backgroundColor: testData.color }}>
                    &nbsp;
                  </div>
                ))}
              </Tooltip>
            )
          }

          // Display just blocks if Test is not given
          return (
            <span key={testData.key}>
              {_.range(5, 0, -1).map(i => (
                <div key={i} className="score">
                  &nbsp;
                </div>
              ))}
            </span>
          )
        })}
      </div>
      <div className="bottomAxisLine">
        {scoreDetails.map((testData, index) => (
          <div key={testData.key} className="axisText">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransitionQuestion
