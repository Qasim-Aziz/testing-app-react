/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-shadow */
// eslint-disable-next-line
import React, { Fragment } from 'react'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]

class GoalDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="card border-white" style={{ backgroundColor: '#f2f4f8' }}>
        <div className="row" style={{ marginLeft: '0px', marginTop: '10px' }}>
          <div className="col-md-3">
            <Select options={options} />
          </div>
          <div className="col-md-3">
            <Select options={options} />
          </div>
          <div className="col-md-5" style={{ padding: '0px' }}>
            <div
              style={{
                backgroundColor: 'grey',
                textAlign: 'center',
                cursor: 'pointer',
                height: '40px',
                lineHeight: '40px',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              Search
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', border: '1px solid #ccc' }}>
          <div className="row" style={{ margin: '0px', minHeight: '80px' }}>
            <div className="col-md-3">
              <div
                style={{
                  height: '55px',
                  width: '90%',
                  marginTop: '12px',
                  backgroundColor: 'grey',
                }}
              />
            </div>
            <div className="col-md-8" style={{ lineHeight: '10px' }}>
              <p style={{ color: 'black', fontWeight: 'bold', paddingTop: '20px' }}>
                Kunal selects the item that doesn&apos;t share the same features
              </p>
              <span>Receptive Language</span> <span>. In Therapy</span>
            </div>
            <div className="col-md-1" style={{ padding: '0px' }}>
              <div
                style={{
                  height: '30px',
                  width: '90%',
                  textAlign: 'center',
                  lineHeight: '30px',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginTop: '15px',
                  marginRight: '15px',
                  backgroundColor: 'grey',
                  cursor: 'pointer',
                }}
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GoalDetails
