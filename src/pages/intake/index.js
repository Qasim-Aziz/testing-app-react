import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Input, Radio, Steps, Button, InputNumber } from 'antd'

const { Step } = Steps

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class sections extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      learnerName: '',
      age: '',
      motherName: '',
      fatherName: '',
      motherContact: '',
      fatherContact: '',
      formOftherapies: '',
      schoolOther: '',
      modeOfcommunications: '',
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
    const {
      current,
      learnerName,
      age,
      motherName,
      fatherName,
      motherContact,
      fatherContact,
      formOftherapies,
      schoolOther,
      modeOfcommunications,
    } = this.state
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
                Personal Information
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="Please state the learner's name"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="learnerName"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={learnerName}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Please state the learner's age"
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
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item label="Please state the learner's gender" style={{ margin: '25px' }}>
                    <Radio.Group>
                      <Radio style={radioStyle} value={1}>
                        Male
                      </Radio>
                      <Radio style={radioStyle} value={2}>
                        Female
                      </Radio>
                      <Radio style={radioStyle} value={3}>
                        Other
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Please state  learner's Mother's name"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="motherName"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={motherName}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Please state  learner's Father's name"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="fatherName"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={fatherName}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Please provide contact details(Email/Mobile)of learner's Mother"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="motherContact"
                      onChange={this.handleChange}
                      value={motherContact}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Please provide contact details(Email/Mobile)of learner's Father"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="fatherContact"
                      onChange={this.handleChange}
                      value={fatherContact}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Has the learner received any form of therapies in the past(ABA,OT,Speech etc) If yes please state below"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="formOftherapies"
                      onChange={this.handleChange}
                      value={formOftherapies}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Does the learner attend school or any other services?"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="schoolOther"
                      onChange={this.handleChange}
                      value={schoolOther}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="What it the learner's mode of communication(words,sign,PECS,none)"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="modeOfcommunications"
                      onChange={this.handleChange}
                      value={modeOfcommunications}
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

export default sections
