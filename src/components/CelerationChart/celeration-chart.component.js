import React from 'react'

const CelerationChart = props => {
  const { chart } = props

  return (
    <div>
      <div>
        <span>Date: </span>
        <span>{chart.date}</span>
      </div>

      <div>
        <span>Title: </span>
        <span>{chart.title}</span>
      </div>

      <div>
        <span>Category: </span>
        <span>{chart.category.name}</span>
      </div>

      <div>
        <span>Notes: </span>
        <span>{chart.notes}</span>
      </div>
    </div>
  )
}

export default CelerationChart
