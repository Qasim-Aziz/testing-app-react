import React from 'react'
import TransitionQuestion from './TransitionQuestion'

const TransitionGraph = ({ questions, scoreDetails }) => (
  <div className="transitionChart">
    {questions.map(question => (
      <TransitionQuestion key={question.queNo} question={question} scoreDetails={scoreDetails} />
    ))}
  </div>
)

export default TransitionGraph
