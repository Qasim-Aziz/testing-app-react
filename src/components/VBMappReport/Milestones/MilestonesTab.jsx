import React from 'react'
import StudentAndTestDetails from '../StudentAndTestDetails'
import MilestonesGraph from './MilestonesGraph'

const MilestonesTab = ({ data }) => (
  <div className="milestoneTab" id="milestones">
    <StudentAndTestDetails scoreDetails={data.scoreDetails} studentDetails={data.studentDetails} />
    <MilestonesGraph
      level1={data.level1}
      level2={data.level2}
      level3={data.level3}
      scoreDetails={data.scoreDetails}
    />
  </div>
)

export default MilestonesTab
