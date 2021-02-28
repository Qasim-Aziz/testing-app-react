import React from 'react'
import MilestoneQuestion from './MilestoneQuestion'
import MilestoneDots from './MilestoneDots'
import { levels } from './milestoneLevels'

const MilestoneItem = ({ levelText, group: { groupName, questions }, scoreDetails }) => (
  <div className="milestoneItem">
    <div key={levelText} className={`level${levelText}`}>
      <div className="groupTitle">{groupName}</div>
      {levels[levelText].questions.map(index => (
        <MilestoneQuestion key={index} index={index} question={questions[index]} />
      ))}
      <MilestoneDots
        allQuestions={questions}
        indexes={levels[levelText].questions}
        scoreDetails={scoreDetails}
      />
    </div>
  </div>
)

export default MilestoneItem
