/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-shadow */
// eslint-disable-next-line
import React, { Fragment } from 'react'
import { Progress } from 'reactstrap'
import './TargetStyle.scss'

class Goals extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="card border-white" style={{ backgroundColor: 'black' }}>
        <div className="card-header" style={{ backgroundColor: 'black', color: 'white' }}>
          <p style={{ fontWeight: 'bold' }}>Bahaviour & Development</p>
          <p style={{ fontSize: '10px' }}>March 1 - December 1, 2020 . 9 Months</p>
        </div>
        <div className="card-body">
          <div
            style={{
              height: '40px',
              backgroundColor: 'grey',
              lineHeight: '25px',
              color: 'white',
              fontWeight: '400',
              marginBottom: '5px',
              cursor: 'pointer',
            }}
          >
            <span style={{ marginLeft: '7px' }}>short term goal 1</span>
            <Progress value="30" />
          </div>
          <div
            style={{
              height: '35px',
              backgroundColor: 'grey',
              textAlign: 'center',
              lineHeight: '35px',
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '5px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            add short term goal
          </div>
        </div>
      </div>
    )
  }
}

export default Goals
