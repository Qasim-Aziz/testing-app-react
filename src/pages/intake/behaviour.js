import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Steps, Button, Checkbox } from 'antd'

const { Step } = Steps

function onChange(checkedValues) {
  console.log('checked = ', checkedValues)
}

class behaviour extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
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
    const { current } = this.state
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

          <div className="col-sm-8">
            <div className="card">
              <p
                style={{
                  fontSize: '25px',
                  textAlign: 'center',
                  backgroundColor: '#3956C4',
                  color: 'white',
                }}
              >
                Behaviours that challenge
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="Is the learner sensitive to the following?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Sound</Checkbox>
                      <br />
                      <Checkbox value="2">Light</Checkbox>
                      <br />
                      <Checkbox value="3">Temperature</Checkbox>
                      <br />
                      <Checkbox value="4">Texture</Checkbox>
                      <br />
                      <Checkbox value="5">Smell</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner engage in the following behaviour(s)?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Hurting self</Checkbox>
                      <br />
                      <Checkbox value="2">Hurting others</Checkbox>
                      <br />
                      <Checkbox value="3">Tantrums (crying, flopping on floor)</Checkbox>
                      <br />
                      <Checkbox value="4">Throwing objects</Checkbox>
                      <br />
                      <Checkbox value="5">Running Away from adults</Checkbox>
                      <br />
                      <Checkbox value="5">Eats inedible items</Checkbox>
                      <br />
                      <Checkbox value="5">Vocal stereotypy (echolalia)</Checkbox>
                      <br />
                      <Checkbox value="5">Motor stereotypy (body rocking)</Checkbox>
                      <br />
                      <Checkbox value="5">Requires the same routine/activity everytime</Checkbox>
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

export default behaviour
