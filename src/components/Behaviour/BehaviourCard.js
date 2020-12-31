/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { ClockCircleOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const DELETE_BEHAVIOUR = gql`
  mutation($id: ID!) {
    deleteBehaviour(input: { pk: $id }) {
      status
      message
    }
  }
`

const MealCard = ({ style, behaviorName, time, note, irt, frequently, id, setDeleteBehaviour }) => {
  const [
    deleteBehaviour,
    { data: deleteBehData, error: deleteBehError, loading: deleteBehLoading },
  ] = useMutation(DELETE_BEHAVIOUR, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (deleteBehData) {
      notification.success({
        message: 'Behaviour delete sucessfully',
      })
      setDeleteBehaviour(id)
    }
    if (deleteBehError) {
      notification.error({
        message: 'Opps their is a error on delete behaviour',
      })
    }
  }, [deleteBehError, deleteBehData])

  const handleDelete = () => {
    deleteBehaviour()
  }
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '26px 35px',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 26,
        }}
      >
        <Title
          style={{
            fontSize: 24,
            lineHeight: '33px',
          }}
        >
          {behaviorName}
        </Title>
        <ClockCircleOutlined style={{ fontSize: 30, marginLeft: 'auto', marginRight: 10 }} />
        <Text
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#2E2E2E',
            marginLeft: 9,
            margin: 0,
            marginRight: 33,
          }}
        >
          {Math.floor(time / 1000)}s
        </Text>

        <Button
          type="link"
          style={{
            color: '#000',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CopyOutlined
            style={{
              fontSize: 26,
            }}
          />
        </Button>
        <Button
          type="link"
          style={{
            color: '#000',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleDelete}
          loading={deleteBehLoading}
        >
          <DeleteOutlined
            style={{
              fontSize: 26,
              color: 'red',
            }}
          />
        </Button>
      </div>

      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          display: 'block',
          color: '#000',
          margin: 0,
          marginBottom: 5,
        }}
      >
        {note}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          margin: 0,
          color: '#000',
        }}
      >
        frequently-{frequently} IRT-{irt}
      </Text>
    </div>
  )
}

export default MealCard
