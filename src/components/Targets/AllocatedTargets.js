/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-shadow */
// eslint-disable-next-line
import React, { Fragment } from 'react'

class AllocatedTargets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="card border-white">
        <div
          className="card-header"
          style={{ color: 'black', fontSize: '18px', fontWeight: '500' }}
        >
          Allocated targets to STG1
        </div>
        <div className="card-body">
          <div
            style={{
              padding: '5px',
              lineHeight: 'normal',
              backgroundColor: 'grey',
              borderRadius: '3px',
              color: 'black',
              fontWeight: '500',
              marginBottom: '10px',
            }}
          >
            Kunal listens to music and tells what genre it belongs to
          </div>
        </div>
      </div>
    )
  }
}

export default AllocatedTargets
