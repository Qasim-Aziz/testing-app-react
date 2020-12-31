import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Row, Col, Card, Calendar, Button, Collapse } from 'antd'
import { UsergroupAddOutlined, VideoCameraOutlined, ClockCircleOutlined } from '@ant-design/icons'
import AppointmentForm from './AppointmentForm'

const { Panel } = Collapse

// map function
const numbers = [
  {
    title: 'Instruction Details',
    appointment: 'app',
    date: '09/04/2020',
    time: '2.00-3.00 pm',
    therapist: 'Monika',
    student: 'Kunal',
  },
  {
    title: 'Instruction Details',
    appointment: 'app',
    date: '02/04/2020',
    time: '7.00-9.00 pm',
    therapist: 'Vajid',
    student: 'Kunal',
  },
]

function onPanelChange(value, mode) {
  console.log(value, mode)
}

class Appointment extends React.Component {
  state = {
    divShow: false,
  }

  consoleValue = e => {
    e.preventDefault()
    this.setState({
      divShow: true,
    })
  }

  render() {
    const { divShow } = this.state

    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <Row gutter={24}>
          <Col span={6}>
            <Card>
              <Collapse accordion>
                <Panel header="Calender" key="1">
                  <div className="site-calendar-demo-card">
                    <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                  </div>
                </Panel>
              </Collapse>
            </Card>
          </Col>
          <Col span={divShow ? 10 : 18}>
            <Button
              type="primary"
              style={{ left: '40px', marginBottom: '10px' }}
              onClick={e => this.consoleValue(e)}
            >
              <UsergroupAddOutlined />
              Appointment
            </Button>

            <ul>
              {numbers.map(num => (
                <div style={{ marginTop: '20px' }}>
                  <Card>
                    <Row>
                      <h5>{num.date}</h5>
                    </Row>

                    <Row>
                      <Col span={4} />
                      <Col span={10}>
                        <h5>
                          {num.title} - {num.therapist} and {num.student}&apos;s Parents
                        </h5>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                      <Col span={4} />
                      <Col span={4}>
                        <h5>
                          <ClockCircleOutlined /> {num.time}
                        </h5>
                      </Col>
                      <Col span={10}>
                        <h5>
                          <a style={{ float: 'right', color: 'red' }}>
                            {' '}
                            <VideoCameraOutlined /> Zoom Online Link
                          </a>
                        </h5>
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))}
            </ul>
          </Col>

          {divShow && (
            <Col span={8}>
              <Card>
                <Button
                  style={{ marginRight: '-12px', float: 'right', border: 'none', padding: 'none' }}
                  onClick={() => this.setState({ divShow: false })}
                >
                  X
                </Button>
                <AppointmentForm />
              </Card>
            </Col>
          )}
        </Row>
      </Authorize>
    )
  }
}

export default Appointment
