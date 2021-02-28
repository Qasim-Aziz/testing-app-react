import React from 'react'
import TaskItem from './TaskItem'

const TaskGraph = ({ level1, level2, level3 }) => {
  const renderBars = (levelText, levelData) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
      {/* <h3 className="text-center">Level {levelText}</h3> */}
      <div style={{ display: 'flex' }}>
        {Object.keys(levelData).map(group => (
          <TaskItem key={`${group}-${levelText}`} levelText={levelText} group={levelData[group]} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="taskChart">
      <div>
        {renderBars(1, level1)}
        {renderBars(2, level2)}
        {renderBars(3, level3)}
      </div>
    </div>
  )
}

export default TaskGraph
