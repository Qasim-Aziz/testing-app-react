import React, { useEffect } from 'react'
import { Typography, Button, notification, Tag } from 'antd'
import { ClockCircleOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { useMutation } from 'react-apollo'
import { DELETE_MEDICAL } from './query'

const { Title, Text } = Typography

const MedicalCard = ({
  style,
  condition,
  startDate,
  endDate,
  note,
  id,
  setUpdateMed,
  refetch,
  severity,
  openDrawer,
}) => {
  const [deleteMedical, { data, error, loading }] = useMutation(DELETE_MEDICAL, {
    update() {
      refetch()
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Delete medical data sucessfull',
      })
    }
    if (error) {
      notification.error({
        message: 'Delete medical data unsucessfull',
      })
    }
  }, [data, error])
  const fontSize = {
    fontSize: 14,
    marginRight: '10px',
  }
  const HeadStyle = {
    fontWeight: '700',
    fontSize: 16,
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
      <div style={{ ...fontSize, display: 'flex' }}>
        <div>
          <span style={HeadStyle}>{condition}: </span>
          <span style={fontSize}>
            {startDate} - {endDate}
          </span>
        </div>
        <div
          style={{
            position: 'absolute',
            right: '0',
          }}
        >
          <Button
            type="link"
            onClick={() => {
              setUpdateMed(id)
              openDrawer()
            }}
            style={{
              color: '#584f4f',
              padding: '2px',
            }}
          >
            <FaEdit style={{ fontSize: '21px' }} />
          </Button>
          <Button
            type="link"
            onClick={() => deleteMedical({ variables: { id } })}
            loading={loading}
            style={{
              color: '#584f4f',
              padding: '2px',
            }}
          >
            <MdDelete style={{ fontSize: '23px' }} />
          </Button>
        </div>
      </div>
      <Text
        style={{
          fontSize: 14,
        }}
      >
        Severity Status: <Tag>{severity}</Tag>
      </Text>
      <Text
        style={{
          fontSize: 14,
          display: 'block',
        }}
      >
        Note: {note}
      </Text>
    </div>
  )
}

export default MedicalCard
