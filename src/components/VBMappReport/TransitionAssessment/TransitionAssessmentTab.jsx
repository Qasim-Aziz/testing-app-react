import React from 'react'
import StudentAndTestDetails from '../StudentAndTestDetails'
import TransitionGraph from './TransitionGraph'

const TransitionAssessmentTab = ({ data }) => (
  <div className="transitionTab" id="transitionAssessment">
    <StudentAndTestDetails scoreDetails={data.scoreDetails} studentDetails={data.studentDetails} />
    <TransitionGraph questions={data.questions} scoreDetails={data.scoreDetails} />
  </div>
)

export default TransitionAssessmentTab
