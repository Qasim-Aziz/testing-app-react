import React, { Component } from 'react'
import { typography, Button, Card, Icon } from 'antd'

class SessionClock extends Component {
  render() {
    const { Title } = typography
    return (
      <Card
        hoverable
        style={{
          width: '100%',
          maxHeight: '300px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
        bodyStyle={{ padding: '10px' }}
      >
        <Title type="secondary">00:00:00</Title>
        <Button>
          <Icon type="caret-left" />
          Start Session
        </Button>
        {/* <Button>Resume Session</Button>
        <Button>Pause</Button>&nbsp; &nbsp;
        <Button>Start</Button> */}
      </Card>
    )
  }
}
export default SessionClock
