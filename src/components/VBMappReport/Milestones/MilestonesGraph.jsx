import React from 'react'
import MilestoneItem from './MilestoneItem'
import { levels } from './milestoneLevels'

const MilestonesGraph = ({ level1, level2, level3, scoreDetails }) => {
  const renderBars = (levelText, levelData) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
      <h3 className="text-center">Level {levelText}</h3>
      <div style={{ display: 'flex' }}>
        <div className="scaleAxis">
          <div className={`level${levelText}`}>
            <div style={{ marginTop: '47px' }} />
            {levels[levelText].questions.map(index => (
              <div key={`${levelText}-${index}`} className="axisLabel">
                {index}
              </div>
            ))}
          </div>
        </div>
        {Object.keys(levelData).map(group => (
          <MilestoneItem
            key={`${group}-${levelText}`}
            levelText={levelText}
            group={levelData[group]}
            scoreDetails={scoreDetails}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="milestoneChart">
      <div>
        {renderBars(3, level3)}
        {renderBars(2, level2)}
        {renderBars(1, level1)}
      </div>
    </div>
  )
}
export default MilestonesGraph
