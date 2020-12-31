import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const DELETE_MEAL = gql`
  mutation deleteFood($id: ID!) {
    deleteFood(input: { pk: $id }) {
      status
      message
    }
  }
`

const MealCard = ({
  style,
  mealName,
  time,
  foodType,
  mealContent,
  waterValue,
  id,
  setMealDeleted,
  setUpdateMealId,
  closeDrawer,
  openDrawer,
}) => {
  const [mutate, { data, error }] = useMutation(DELETE_MEAL, {
    variables: {
      id,
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Meal Data',
        description: 'Meal Data Deleted Successfully',
      })
      setMealDeleted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Somthing want wrong',
        description: error,
      })
    }
  }, [error])
  const fontSize = {
    fontSize: 14,
    marginRight: '10px',
  }
  const HeadStyle = {
    fontWeight: '700',
    fontSize: 16,
  }
  const btnClm = {
    position: 'absolute',
    right: '4px',
    top: '5px',
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        padding: '10px',
        position: 'relative',
        display: 'flex',
        width: '1108px',
        border: '2px solid #2a8ff7',
        ...style,
      }}
    >
      <div>
        <div style={{ ...fontSize, display: 'flex' }}>
          <div>
            <span style={HeadStyle}>{mealName} :</span>
            <span style={fontSize}> {mealContent}</span>
            <span style={{ color: foodType === 'Junk Food' ? 'red' : 'green' }}>{foodType}</span>
          </div>
          <div style={{ position: 'absolute', right: '0' }}>
            <Button
              type="link"
              style={{
                color: '#584f4f',
                padding: '2px',
              }}
              onClick={() => {
                setUpdateMealId(id)
                openDrawer()
              }}
            >
              <FaEdit style={{ fontSize: '21px' }} />
            </Button>
            <Button
              type="link"
              style={{
                color: '#584f4f',
                padding: '2px',
              }}
              onClick={() => {
                mutate()
              }}
            >
              <MdDelete style={{ fontSize: '23px' }} />
            </Button>
          </div>
        </div>

        <div style={fontSize}>Water {waterValue}ml</div>
        <div style={fontSize}>{time}</div>
      </div>
    </div>
  )
}

export default MealCard
