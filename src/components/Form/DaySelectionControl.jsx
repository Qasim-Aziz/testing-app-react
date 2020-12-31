import React, { useState } from 'react'
import { Tag } from 'antd'

const { CheckableTag } = Tag

const DaySelectionControl = ({ onDaySelectionChange }) => {
  const days = [
    { displayText: 'Sun', value: 'Sunday' },
    { displayText: 'Mon', value: 'Monday' },
    { displayText: 'Tue', value: 'Tuesday' },
    { displayText: 'Wed', value: 'Wednesday' },
    { displayText: 'Thur', value: 'Thursday' },
    { displayText: 'Fri', value: 'Friday' },
    { displayText: 'Sat', value: 'Saturday' },
  ]
  const [selectedDays, setSelectedDays] = useState(
    days.filter(x => x.displayText !== 'Sun' && x.displayText !== 'Sat'),
  )

  const handleDayCheck = (day, checked) => {
    // Update local state
    const updatedSelection = checked
      ? [...selectedDays, day]
      : selectedDays.filter(d => d.displayText !== day.displayText)
    setSelectedDays(updatedSelection)

    // Call to callback with values
    onDaySelectionChange(updatedSelection)
  }

  return (
    <>
      {days.map(day => (
        <CheckableTag
          key={day.displayText}
          checked={selectedDays.some(x => x.displayText === day.displayText)}
          onChange={checked => handleDayCheck(day, checked)}
        >
          {day.displayText}
        </CheckableTag>
      ))}
    </>
  )
}

export default DaySelectionControl
