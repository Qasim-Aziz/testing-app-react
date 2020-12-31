import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Input, Steps, Button, Checkbox, InputNumber } from 'antd'

const { Step } = Steps

function onChange(checkedValues) {
  console.log('checked = ', checkedValues)
}

class medical extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lernerDiagnosis: '',
      age: '',
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
    const { current, lernerDiagnosis, age } = this.state
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
                Medical History
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="Learner's diagnosis"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="lernerDiagnosis"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={lernerDiagnosis}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="At what age did the learner receive diagnosis?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <InputNumber
                      name="age"
                      min={1}
                      max={100000}
                      defaultValue={0}
                      value={age}
                      onChange={onChange}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Does the learner have any comorbidities along with the orginial diagnosis?If yes,please select"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="Asthma">Asthma</Checkbox>
                      <br />
                      <Checkbox value="sleepingProblems">Sleeping problems</Checkbox>
                      <br />
                      <Checkbox value="gastrointestinalIssue">Gastrointestinal issue</Checkbox>
                      <br />
                      <Checkbox value="infection">Infection(ear,skin etc)</Checkbox>
                      <br />
                      <Checkbox value="seizures">Seizures</Checkbox>
                      <br />
                      <Checkbox value="anxiety">Anxiety</Checkbox>
                      <br />
                      <Checkbox value="ocd">OCD</Checkbox>
                      <br />
                      <Checkbox value="hyperactivity">Hyperactivity</Checkbox>
                      <br />
                      <Checkbox value="other">Other</Checkbox>
                      <br />
                    </Checkbox.Group>
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

export default medical
