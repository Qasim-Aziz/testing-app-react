/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import DailyVitals from './ProgramDailyVitals'

@connect(({ student, user }) => ({ student, user }))
class Meal extends PureComponent {
  render() {
    return (
      <>
        <DailyVitals activeTab="Toilet Data" />
      </>
    )
  }
}
export default Meal
