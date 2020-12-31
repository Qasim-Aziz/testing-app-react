import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import { Redirect } from 'react-router-dom'
import {
  Tabs,
  Drawer,
  Form,
  Button,
  Popover,
  Col,
  Row,
  DatePicker,
  Input,
  Spin,
  Select,
} from 'antd'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

const colors = [
  '#FF9C52',
  '#3E7BFA',
  '#5F6CAF',
  '#4BAEA0',
  '#FF8080',
  '#7480FF',
  '#AAAAAA',
  '3E7BFA',
]

class NewAssessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedColor: '#FF9C52',
      done: false,
    }
  }

  handleNewAssessment = e => {
    e.preventDefault()
    const { selectedColor } = this.state
    const { location, history } = this.props
    const { student } = location
    client
      .mutate({
        mutation: gql`
      mutation{
        vbmappCreateAssessment(input:{
            student:"${student}", 
            color:"${selectedColor}"
        }){
            status,
            message,
            details{
                id,
                testNo,
                date,
                color,
                student{
                    id,
                    firstname
                }
            }
        }
    }`,
      })
      .then(result => {
        console.log(JSON.stringify(result))
        this.setState({
          done: true,
        })
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  getColors = () => {
    const { selectedColor } = this.state
    const colorsView = []
    for (let x = 0; x < colors.length; x += 1) {
      if (colors[x] === selectedColor) {
        colorsView.push(
          <div
            style={{
              backgroundColor: colors[x],
              height: 40,
              width: 40,
              borderRadius: 8,
              border: '3px solid blue',
              marginLeft: 10,
              marginRight: 10,
            }}
          />,
        )
      } else {
        colorsView.push(
          <div
            role="button"
            tabIndex="0"
            onKeyDown={this.handleKeyDown}
            onClick={() => this.setState({ selectedColor: colors[x] })}
            style={{
              backgroundColor: colors[x],
              height: 40,
              width: 40,
              borderRadius: 8,
              marginLeft: 10,
              marginRight: 10,
            }}
          />,
        )
      }
    }
    return colorsView
  }

  handleKeyDown = () => {}

  render() {
    const { location } = this.props
    const { done } = this.state
    const { test } = location
    const assessment = `Assessment ${test}`
    if (done === true) {
      return <Redirect to="/therapy/vbmapps/list" />
    }
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <Form onSubmit={this.handleNewAssessment}>
                <Form.Item>
                  <Input value={assessment} disabled />
                </Form.Item>
                <Form.Item>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>{this.getColors()}</div>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Create Assessment
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default NewAssessment
