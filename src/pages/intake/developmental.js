import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Input, Steps, Button, Radio } from 'antd'

const { Step } = Steps

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class developmental extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      difficulties: '',
    }
  }

  onChange = current => {
    console.log('onChange:', current)
    this.setState({ current })
  }

  onChange(value) {
    console.log('changed', value)
    this.setState({})
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { current, difficulties } = this.state
    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />

        <div className="row justify-content-md-center">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div>
                  <Steps current={current} onChange={this.onChange}>
                    <Step title="Step 1" description="Personal information" />
                    <Step title="Step 2" description="Medical History" />
                    <Step title="Step 3" description="Developmental" />
                    <Step title="Step 4" description="Pre-requisite skill assessment" />
                    <Step title="Step 5" description="Behaviours that challenge" />
                    <Step title="Step 6" description="Other skills" />
                    <Step title="Step 7" description="Preference Assessment" />
                  </Steps>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-7">
            <div className="card">
              <p
                style={{
                  fontSize: '25px',
                  textAlign: 'center',
                  backgroundColor: '#3956C4',
                  color: 'white',
                }}
              >
                Developmental history
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item label="Did the learner meet all the milestones at an appropriate age?">
                    <Radio.Group>
                      <Radio style={radioStyle} value={1}>
                        Yes
                      </Radio>
                      <Radio style={radioStyle} value={2}>
                        No
                      </Radio>
                      <Radio style={radioStyle} value={3}>
                        Maybe
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item label="What were the difficulties the learner faced in meeting any of the milestones?(eg:speech,walking,toileting etc)">
                    <Input
                      name="difficulties"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={difficulties}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <div style={{ marginLeft: '40%' }}>
                    <Form.Item>
                      <Button type="submit" htmlType="submit">
                        Back
                      </Button>

                      <Button htmlType="primary" onClick={this.onReset} className="ml-4">
                        Next
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default developmental
