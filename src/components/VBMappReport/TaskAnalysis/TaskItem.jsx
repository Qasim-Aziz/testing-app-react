import React from 'react'
import TaskQuestion from './TaskQuestion'
import { levels } from './taskLevels'

const TaskItem = ({ levelText, group: { groupName, questions } }) => (
  <div className="taskItem">
    <div className={`level${levelText}`}>
      <div className="groupTitle">{groupName}</div>
      {levels[levelText].questions.map(index => (
        <TaskQuestion key={index} index={index} groupName={groupName} question={questions[index]} />
      ))}
    </div>
  </div>
)

export default TaskItem
