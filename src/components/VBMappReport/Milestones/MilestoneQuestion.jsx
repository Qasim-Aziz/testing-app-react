import React from 'react'
import { Tooltip } from 'antd'

const MilestoneQuestion = ({ index, question }) => {
  const getStyleBasedOnScore = que => {
    const colorForFalse = 'transparent'
    const colorForSeparation = 'rgba(16, 17, 16, 0.1)'

    // If question exist then choose based on that color & score
    if (que) {
      const { score, color: colorForTrue } = que
      if (score === 0.5) {
        return {
          background: `linear-gradient(to top, ${colorForTrue} 0%, ${colorForTrue} 49%, ${colorForSeparation} 49%, ${colorForSeparation} 51%, ${colorForFalse} 51%, ${colorForFalse} 100%)`,
        }
      }
      if (score === 1) {
        return {
          background: `linear-gradient(to top, ${colorForTrue} 0%, ${colorForTrue} 49%, ${colorForSeparation} 49%, ${colorForSeparation} 51%, ${colorForTrue} 51%, ${colorForTrue} 100%)`,
        }
      }
    }

    // If question does not exist or score is 0 then
    return {
      background: `linear-gradient(to top, ${colorForFalse} 0%, ${colorForFalse} 49%, ${colorForSeparation} 49%, ${colorForSeparation} 51%, ${colorForFalse} 51%, ${colorForFalse} 100%)`,
    }
  }

  const getTooltip = que => (
    <div>
      <div>
        <b>Que: </b>
        {que.questionNum}
      </div>
      <div>
        <b>Score: </b>
        {que.score}
      </div>
      <div>
        <b>Test: </b>
        {que.testName}
      </div>
    </div>
  )

  if (!question)
    return (
      <div className="question" style={getStyleBasedOnScore()}>
        &nbsp;
      </div>
    )

  return (
    <Tooltip placement="top" title={getTooltip(question)}>
      <div className="question" style={getStyleBasedOnScore(question)}>
        &nbsp;
      </div>
    </Tooltip>
  )
}

export default MilestoneQuestion
