/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { ClockCircleOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { MdDelete } from 'react-icons/md'
import { AiFillCopy } from 'react-icons/ai'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const DELETE_BEHAVIOR = gql`
  mutation($id: ID!) {
    deleteBehaviour(input: { pk: $id }) {
      status
      message
    }
  }
`

const MealCard = ({ style, behaviorName, time, note, irt, frequently, id, setDeleteBehavior }) => {
  const [
    deleteBehavior,
    { data: deleteBehData, error: deleteBehError, loading: deleteBehLoading },
  ] = useMutation(DELETE_BEHAVIOR, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (deleteBehData) {
      notification.success({
        message: 'Behavior deleted successfully',
      })
      setDeleteBehavior(id)
    }
    if (deleteBehError) {
      notification.error({
        message: 'Opps their is a error on delete behavior',
      })
    }
  }, [deleteBehError, deleteBehData])

  const handleDelete = () => {
    deleteBehavior()
  }
  return (
    <div
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px',
        position: 'relative',
        width: '1108px',
        border: '2px solid #2a8ff7',
        ...style,
      }}
    >
      <div>
        <div style={{ display: 'flex' }}>
          <Title
            style={{
              fontSize: 16,
            }}
          >
            {behaviorName}
          </Title>
          <div style={{ position: 'absolute', right: '0' }}>
            {/* <Button
              type="link"
              style={{
                color: '#584f4f',
                padding: '2px',
              }}
            >
              <AiFillCopy
                style={{
                  fontSize: 21,
                }}
              />
            </Button> */}
            <Button
              type="link"
              style={{
                color: '#584f4f',
                padding: '2px',
              }}
              onClick={handleDelete}
              loading={deleteBehLoading}
            >
              <MdDelete
                style={{
                  fontSize: 23,
                }}
              />
            </Button>
          </div>
        </div>

        <div>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {Math.floor(time / 1000)} seconds
          </Text>
        </div>

        <div>
          <Text
            style={{
              fontSize: 14,
            }}
          >
            Frequently-{frequently} IRT-{irt}
          </Text>
        </div>
        <div>
          <Text
            style={{
              fontSize: 14,
              lineHeight: '26px',
              display: 'block',
              color: '#000',
              margin: 0,
              marginBottom: 5,
            }}
          >
            {note}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default MealCard
