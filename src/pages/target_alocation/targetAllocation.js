/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-shadow */
import React from 'react'
import { Form, Input, Button, Select, DatePicker, notification } from 'antd'
import TargetHeader from 'components/Targets/TargetHeader'
import Goals from 'components/Targets/Goals'
import AllocatedTargets from 'components/Targets/AllocatedTargets'
import GoalDetails from 'components/Targets/GoalDetails'

class TargetAllocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="row">
          <div className="col-sm-6 col-md-4">
            <TargetHeader />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <Goals />
          </div>

          <div className="col-sm-6 col-md-6" style={{ backgroundColor: '#f2f4f8' }}>
            <GoalDetails />
          </div>

          <div className="col-sm-6 col-md-3">
            <AllocatedTargets />
          </div>
        </div>

        <button
          type="button"
          style={{
            position: 'absolute',
            height: '40px',
            width: '23%',
            bottom: '10px',
            backgroundColor: 'grey',
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          add long term goal
        </button>
      </div>
    )
  }
}

const targetAllocation = Form.create()(TargetAllocation)
export default targetAllocation
