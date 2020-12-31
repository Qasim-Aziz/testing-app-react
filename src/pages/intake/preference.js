import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
//    import personal from 'components/sections/personal'
import { Form, Input, Steps, Button } from 'antd'

const { Step } = Steps

class Preference extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      toys: '',
      activities: '',
      edibles: '',
      acknowledgement: '',
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
    const { current, toys, activities, edibles, acknowledgement } = this.state
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
                Preference Assessment
              </p>
              <p style={{ marginLeft: '5%' }}>What does the learner like? </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="List down the toys (cars, clay) the learner likes/plays with the most"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="toys"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={toys}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                  <hr />

                  <Form.Item
                    label="List down the activities/ games (tickles, slides) the learner engages in/like to do the most"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="activities"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={activities}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                  <hr />
                  <Form.Item
                    label="List down the edibles (eg: cookie, chocolate) the learner likes to eat the most"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="edibles"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={edibles}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>
                  <hr />
                  <Form.Item
                    label="List down the kind of social acknowledgement (praise, claps, pat on the back) the learner likes the most"
                    style={{ margin: '5px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      name="acknowledgement"
                      placeholder="Your answer"
                      onChange={this.handleChange}
                      value={acknowledgement}
                      style={{ width: '70%' }}
                    />
                  </Form.Item>

                  <div style={{ marginLeft: '30%' }}>
                    <Form.Item>
                      <Button type="submit" htmlType="submit">
                        Back
                      </Button>

                      <Button htmlType="primary" onClick={this.onReset} className="ml-4">
                        Submit
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

export default Preference
