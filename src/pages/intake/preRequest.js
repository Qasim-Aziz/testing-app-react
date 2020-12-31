import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Steps, Button, Checkbox } from 'antd'

const { Step } = Steps

function onChange(checkedValues) {
  console.log('checked = ', checkedValues)
}

class preRequest extends React.Component {
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
                Pre-requisite skill assessment
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="Does the learner make eye conteact in the following instances?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not make eye contact</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Spontaneous eye contact- can child look at you while playing?
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        While speaking- does child give eye contact while talking to you for a 1-2
                        seconds?
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        While listening- does child give eye contact when you are speaking to the
                        child?
                      </Checkbox>
                      <br />
                      <Checkbox value="5">
                        Sustained eye contact during the conversation- can child look at you for 4-6
                        seconds when you sing a song or tell a story?
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner sit independently in the following situations?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not sit</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Sits with preferred(things the learner likes) toys/ activity/ edible
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        Sits without any preferred toys/ activity/ edible
                      </Checkbox>
                      <br />
                      <Checkbox value="4">Sits with parents/ familiar people in sight</Checkbox>
                      <br />
                      <Checkbox value="5">Sits without parents/ familiar people in sight</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="How often does the learner respond to his/her name when called by following people/ conditions?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not respond to anyone</Checkbox>
                      <br />
                      <Checkbox value="2">Familiar people</Checkbox>
                      <br />
                      <Checkbox value="3">New people</Checkbox>
                      <br />
                      <Checkbox value="4">
                        Responds to someone calling name by saying, yes, coming etc.
                      </Checkbox>
                      <br />
                      <Checkbox value="5">
                        From a close distance (when standing next to the child)
                      </Checkbox>
                      <br />
                      <Checkbox value="5">From a distance (more than 5-10 feet away)</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner wait?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not wait at all</Checkbox>
                      <br />
                      <Checkbox value="2">For preferred item</Checkbox>
                      <br />
                      <Checkbox value="3">For non-preferred item</Checkbox>
                      <br />
                      <Checkbox value="4">Without any activity</Checkbox>
                      <br />
                      <Checkbox value="5">
                        In natural environment like Hospitals and Supermarkets
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="How well does the learner use toilet?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">
                        does not do any of the steps to use the toilet independently
                      </Checkbox>
                      <br />
                      <Checkbox value="2">
                        Indicates the need to urinate/deficate (by signing or words)
                      </Checkbox>
                      <br />
                      <Checkbox value="3">Initiates going to the bathroom</Checkbox>
                      <br />
                      <Checkbox value="4">Urinates or deficates in the pot</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Is the learner compliant (listens to instructions) with the following people"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Not compliant with anyone</Checkbox>
                      <br />
                      <Checkbox value="2">Family members at home</Checkbox>
                      <br />
                      <Checkbox value="3">
                        With familiar people at school (teachers and peers)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">With new people at home</Checkbox>
                      <br />
                      <Checkbox value="4">
                        With new people in social settings like school/ restaurant
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does learner willingly take turns during play with following people?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not take turns</Checkbox>
                      <br />
                      <Checkbox value="2">Parents and Family members</Checkbox>
                      <br />
                      <Checkbox value="3">With teachers and friends at school</Checkbox>
                      <br />
                      <Checkbox value="4">With familiar people</Checkbox>
                      <br />
                      <Checkbox value="4">With new people</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner shares items/edibles etc with the following people"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not share with anyone</Checkbox>
                      <br />
                      <Checkbox value="2">Parents/ family members</Checkbox>
                      <br />
                      <Checkbox value="3">Familiar people</Checkbox>
                      <br />
                      <Checkbox value="4">Teachers and friends at school</Checkbox>
                      <br />
                      <Checkbox value="4">New people</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner pays attention to the following?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not pay attention at all</Checkbox>
                      <br />
                      <Checkbox value="2">Sounds or people around</Checkbox>
                      <br />
                      <Checkbox value="3">Sounds and voices of people at a distance</Checkbox>
                      <br />
                      <Checkbox value="4">
                        Sustains attention while working or doing an activity
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner carefully attends to/ looks at the following things"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">
                        Things placed on the table in front of the learner
                      </Checkbox>
                      <br />
                      <Checkbox value="2">Things that are nearby/ close to the learner</Checkbox>
                      <br />
                      <Checkbox value="3">
                        Things that are placed at a distance/ far from the learner
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Looks at things in natural environment like rack displays at a Superstore
                      </Checkbox>
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

export default preRequest
