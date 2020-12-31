import React, { Component } from 'react'
import { FaChartPie, FaBookmark } from 'react-icons/fa'
import moment from 'moment'

class AssessmentCard extends Component {
  handleKeyDown = () => {}

  render() {
    const {
      test,
      active,
      date,
      milestones,
      barriers,
      eesa,
      transitions,
      selected,
      selectionHandler,
    } = this.props
    const outputDate = moment(date).format('MMMM DD, YYYY')
    let bg = '#FFF'
    let textColor = '#000'
    if (selected === true) {
      bg = '#3E7BFA'
      textColor = '#FFF'
    }
    return (
      <div
        role="button"
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        onClick={this.selectionHandler(test)}
        style={{
          backgroundColor: bg,
          color: textColor,
          cursor: 'pointer',
          boxShadow:
            '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 10,
          flex: 1,
          marginTop: 20,
        }}
      >
        <p style={{ fontSize: 18, fontWeight: '700', marginBottom: 0 }}>Assessment {test}</p>
        <p>
          {active === 1 && <span style={{ marginRight: 10 }}>23% completed</span>}
          <span>{outputDate}</span>
        </p>
        <div
          style={{
            paddingBottom: 5,
            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            display: 'flex',
          }}
        >
          <p style={{ fontSize: 12 }}>Milestones: {milestones}</p>
          <p style={{ fontSize: 12 }}>Barriers: {barriers}</p>
          <p style={{ fontSize: 12 }}>EESA: {eesa}</p>
          <p style={{ fontSize: 12 }}>Transitions: {transitions}</p>
        </div>
        <div style={{ flexDirection: 'row', display: 'flex', marginTop: 10 }}>
          <p style={{ marginRight: 10 }}>
            <FaChartPie /> IEP Report
          </p>
          <p>
            <FaBookmark /> Notes
          </p>
          <p>
            <FaBookmark /> Suggest Target
          </p>
        </div>
      </div>
    )
  }
}

export default AssessmentCard
