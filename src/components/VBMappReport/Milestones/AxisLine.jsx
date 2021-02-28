import React from 'react'

const AxisLine = () => {
  const levels = [
    {
      level: 3,
      questions: [15, 14, 13, 12, 11],
    },
    {
      level: 2,
      questions: [10, 9, 8, 7, 6],
    },
    {
      level: 1,
      questions: [5, 4, 3, 2, 1],
    },
  ]

  return (
    <div className="scaleAxis">
      {levels.map(({ level, questions }) => (
        <div key={level} className={`level${level}`}>
          <div style={{ marginTop: level === 3 ? '47px' : '71px' }} />
          {questions.map(index => (
            <div key={index} className="axisLabel">
              {index}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default AxisLine
