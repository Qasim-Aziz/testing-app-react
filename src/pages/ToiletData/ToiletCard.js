import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { useMutation } from 'react-apollo'
import { DELETE_TOILET, TOILET_DATA } from './query'

const { Title, Text } = Typography

const ToiletCard = ({
  style,
  urination,
  bowel,
  time,
  prompted,
  id,
  dataObj,
  setUpdateToilet,
  selectDate,
  openDrawer,
  refetch,
  setCurrentCardDate,
}) => {
  const studentId = localStorage.getItem('studentId')
  const [deleteToilet, { data, error, loading }] = useMutation(DELETE_TOILET, {
    update(cache) {
      const toiletData = cache.readQuery({
        query: TOILET_DATA,
        variables: {
          student: studentId,
          date: selectDate,
        },
      })
      cache.writeQuery({
        query: TOILET_DATA,
        variables: {
          student: studentId,
          date: selectDate,
        },
        data: {
          getToiletData: {
            edges: toiletData.getToiletData.edges.filter(({ node }) => id !== node.id),
            __typename: 'ToiletDataTypeConnection',
          },
        },
      })
    },
  })
  const conBinefunc = () => {
    console.log(dataObj, 'data Obj')
    setCurrentCardDate(dataObj.date)
    setUpdateToilet(dataObj)
    openDrawer()
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Delete toilet data sucessfully',
      })
      if (refetch) {
        refetch()
      }
    }
    if (error) {
      notification.error({
        message: 'Delete toilet data unsucessfull',
      })
    }
  }, [data, error])

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
      <div style={{ display: 'flex' }}>
        <Title
          style={{
            fontSize: 16,
            color: '#514d6a',
          }}
        >
          {urination && 'Urination'}
          {bowel && urination && ' & Bowel'}
          {bowel && !urination && 'Bowel'}
        </Title>
        <span>
          <div style={{ position: 'absolute', right: '0' }}>
            <Button
              type="link"
              onClick={() => conBinefunc()}
              style={{
                padding: 0,
              }}
            >
              <FaEdit style={{ fontSize: 22, color: '#584f4f' }} />
            </Button>
            <Button
              type="link"
              loading={loading}
              style={{
                width: 'fit-content',
              }}
              onClick={() => {
                deleteToilet({
                  variables: {
                    id,
                  },
                })
              }}
            >
              <MdDelete style={{ fontSize: 22, color: '#584f4f' }} />
            </Button>
          </div>
        </span>
      </div>
      <div style={{ display: 'flex' }}>
        <Text
          style={{
            fontSize: 14,
            color: '#2E2E2E',
            marginRight: 10,
          }}
        >
          {time}
        </Text>
        <Text
          style={{
            fontSize: 14,
          }}
        >
          {prompted && bowel && urination ? (
            <span style={{ color: 'green' }}>Independent Request</span>
          ) : (
            <span style={{ color: 'red' }}>Prompted to Request</span>
          )}
        </Text>
      </div>
    </div>
  )
}

export default ToiletCard
