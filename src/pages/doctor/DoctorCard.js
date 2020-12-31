/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import profileImg from 'images/student.jpg'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { useMutation } from 'react-apollo'
import { DELETE_DOCTOR, GET_DOCTORS } from './query'

const { Title, Text } = Typography

export default ({ node, setSelectDoctor, setUpdateDoctor, selectDoctor }) => {
  const [deleteDoctor, { data, error, loading }] = useMutation(DELETE_DOCTOR, {
    variables: {
      doctorId: node.id,
    },
    update(cache) {
      const cacheData = cache.readQuery({ query: GET_DOCTORS })
      const deletedDoctorId = node.id
      cache.writeQuery({
        query: GET_DOCTORS,
        data: {
          getDoctors: {
            edges: cacheData.getDoctors.edges.filter(({ node }) => {
              return node.id !== deletedDoctorId
            }),
            __typename: 'DoctorsTypeConnection',
          },
        },
      })
    },
  })

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Doctor deleted sucessfully',
      })
    }
    if (error) {
      notification.error({
        message: 'Failed to delete doctor',
      })
    }
  }, [data, error])

  return (
    <div
      style={{
        display: 'flex',
        background: '#fff',
        boxShadow:
          '0px 0px 1px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        cursor: 'pointer',
      }}
      onClick={() => setSelectDoctor(node.id)}
    >
      <img
        src={profileImg}
        alt="profile"
        style={{
          width: 56,
          heigth: 56,
          borderRadius: '50%',
          marginRight: 12,
        }}
      />
      <div>
        <Title style={{ fontSize: 19, color: '#45494E', marginBottom: 4 }}>{node.name}</Title>
        <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>
          {node.location} .&nbsp;
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(95, 95, 95, 0.75)' }}>{node.practicingArea}</Text>
      </div>
      <Button type="link" style={{ marginLeft: 'auto' }} onClick={() => setUpdateDoctor(node.id)}>
        <FormOutlined style={{ fontSize: 24 }} />
      </Button>
      <Button
        type="link"
        style={{ marginLeft: 2 }}
        onClick={() => deleteDoctor(node.id)}
        loading={loading}
      >
        <DeleteOutlined style={{ fontSize: 24, color: 'red' }} />
      </Button>
    </div>
  )
}
