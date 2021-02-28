import React from 'react'
import StudentAndTestDetails from '../StudentAndTestDetails'
import BarriersGraph from './BarriersGraph'

const BarriersTab = ({ data }) => (
  <div className="barrierTab" id="barriers">
    <StudentAndTestDetails scoreDetails={data.scoreDetails} studentDetails={data.studentDetails} />
    <BarriersGraph questions={data.questions} scoreDetails={data.scoreDetails} />
  </div>
)

export default BarriersTab
