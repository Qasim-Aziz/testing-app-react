import React from 'react'

const MilestoneDots = ({ allQuestions, indexes, scoreDetails }) => {
  const getCircleStyle = assesment => {
    const answeredQuestions = []
    indexes.forEach(index => {
      answeredQuestions.push(allQuestions[index])
    })

    const isAllAnswersAreWrong = answeredQuestions.every(
      que => que && que.testName === assesment.testTitle && que.score === 0,
    )
    if (isAllAnswersAreWrong) return { color: assesment.color }

    return {}
  }

  return (
    <div className="milestoneDots">
      {scoreDetails.map(assesment => (
        <div key={assesment.key} className="dot" style={getCircleStyle(assesment)}>
          0
        </div>
      ))}
    </div>
  )
}
export default MilestoneDots
