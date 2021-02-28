import React from 'react'
import BarrierQuestion from './BarrierQuestion'

const BarriersGraph = ({ questions, scoreDetails }) => (
  <div className="barriersChart">
    {questions.map(question => (
      <BarrierQuestion key={question.queNo} question={question} scoreDetails={scoreDetails} />
    ))}
  </div>
)

export default BarriersGraph
