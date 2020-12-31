/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-shadow */
// eslint-disable-next-line
import React, { Fragment } from 'react'

class TargetHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="card border-white" style={{ height: '80px', backgroundColor: 'grey' }}>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              height: '50px',
              width: '50px',
              marginLeft: '15px',
              marginTop: '15px',
              backgroundColor: 'white',
            }}
          />
          <p
            style={{
              paddingLeft: '15px',
              color: 'black',
              fontWeight: 'bold',
              lineHeight: '80px',
            }}
          >
            Kunal&apos;s Goals
          </p>
        </div>
      </div>
    )
  }
}

export default TargetHeader
