import React from 'react'
import { Card, Typography, Button } from 'antd'
import { createUseStyles } from 'react-jss'

const { Title, Text } = Typography

const useStyle = createUseStyles(() => ({
  infoText: {
    fontSize: 18,
    lineHeight: '26px',
    color: '#000',
  },
}))

export default ({ style }) => {
  const classes = useStyle()

  return (
    <Card
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        height: 130,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
      bodyStyle={{
        padding: '17px 35px',
      }}
    >
      <Title
        style={{
          fontSize: 24,
          lineHeight: '33px',
        }}
      >
        Leave Requested
      </Title>
      <Text className={classes.infoText}>March 31 - April 4</Text>
      <Text className={classes.infoText}>Pending</Text>
      <Text className={classes.infoText} style={{ display: 'block' }}>
        I have Medical appointment with my cardiologist.
      </Text>

      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 15,
        }}
      >
        <Button
          type="sussess"
          style={{
            marginRight: 20,
            width: 90,
            background: '#26E768',
            borderRadius: 4,
            color: '#fff',
            height: 32,
          }}
        >
          Approve
        </Button>
        <Button
          type="danger"
          style={{
            marginRight: 20,
            width: 90,
            background: '#FF5858',
            borderRadius: 4,
            height: 32,
          }}
        >
          Reject
        </Button>
      </div>
    </Card>
  )
}
