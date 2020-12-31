import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Form, Input, Radio } from 'antd'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class personal extends React.Component {
  render() {
    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <div className="utils__title utils__title--flat mb-3" />

        <div className="row justify-content-md-center">
          <div className="col-sm-7">
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
            <div>
              <Form>
                <div className="card">
                  <Form.Item
                    label="Please state the learner's name"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input name="learnerName" placeholder="Your answer" style={{ width: '70%' }} />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Please state the learner's age"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input name="age" placeholder="Your answer" style={{ width: '70%' }} />
                  </Form.Item>
                </div>

                <div className="card">
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
                </div>

                <div className="card">
                  <Form.Item
                    label="Please state  learner's Mother's name"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input name="motherName" placeholder="Your answer" style={{ width: '70%' }} />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Please state  learner's Father's name"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input name="fatherName" placeholder="Your answer" style={{ width: '70%' }} />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Please provide contact details(Email/Mobile)of learner's Mother"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="motherContact"
                      placeholder="Your answer"
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Please provide contact details(Email/Mobile)of learner's Father"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="fatherContact"
                      placeholder="Your answer"
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Has the learner received any form of therapies in the past(ABA,OT,Speech etc) If yes please state below"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="formOftherapies"
                      placeholder="Your answer"
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="Does the learner attend school or any other services?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input name="schoolOrany" placeholder="Your answer" style={{ width: '70%' }} />
                  </Form.Item>
                </div>

                <div className="card">
                  <Form.Item
                    label="What it the learner's mode of communication(words,sign,PECS,none)"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="modeOfcommunications"
                      placeholder="Your answer"
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default personal
