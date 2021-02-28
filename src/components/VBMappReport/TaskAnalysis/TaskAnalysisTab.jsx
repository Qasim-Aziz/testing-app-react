import React from 'react'
import StudentAndTestDetails from '../StudentAndTestDetails'
import TaskGraph from './TaskGraph'

const TaskAnalysisTab = ({ data }) => (
  <div className="taskTab" id="taskAnalysis">
    <StudentAndTestDetails scoreDetails={data.scoreDetails} studentDetails={data.studentDetails} />
    <TaskGraph level1={data.level1} level2={data.level2} level3={data.level3} />
  </div>
)

export default TaskAnalysisTab
