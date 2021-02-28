/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Typography, Button, notification } from 'antd'
import recordIcon from 'icons/racord.png'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Title, Text } = Typography

const DELETE_TEMP = gql`
  mutation deleteTemplate($id: ID!) {
    deleteTemplate(input: { pk: $id }) {
      status
      message
    }
  }
`

const TampletCard = ({
  style,
  behaviourName,
  description,
  status,
  envsNum,
  setSelectTamplate,
  setUpdateTempId,
  setDeleteTem,
  id,
}) => {
  const [deleteTemp, { data, loading, error }] = useMutation(DELETE_TEMP)

  const handleDeleteTemp = () => {
    deleteTemp({
      variables: {
        id,
      },
    })
  }

  useEffect(() => {
    if (data) {
      notification.success({
        message: 'Delete Template Sucessfully',
      })
      setDeleteTem(id)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Opps their something wrong',
      })
    }
  }, [error])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      style={{
        padding: '13px 20px',
        width: '99.70%',
        background: '#FFFFFF',
        border: '1px solid #E4E9F0',
        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
        borderRadius: 10,
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title
          style={{
            fontSize: 18,
            lineHeight: '25px',
            textTransform: 'capitalize',
            margin: 0,
            display: 'inline',
          }}
        >
          {behaviourName}
        </Title>
        <Button
          type="link"
          style={{ marginLeft: 'auto', padding: 0 }}
          disabled={loading}
          onClick={() => {
            setUpdateTempId(id)
          }}
        >
          <FormOutlined style={{ fontSize: 24 }} />
        </Button>
        <Button
          type="link"
          style={{ paddingRight: 0 }}
          onClick={handleDeleteTemp}
          loading={loading}
        >
          <DeleteOutlined style={{ fontSize: 24, color: 'red' }} />
        </Button>
      </div>

      <Text
        style={{
          marginTop: 4,
          fontSize: 16,
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        {description}
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '26px',
          color: '#000',
          display: 'block',
          margin: 0,
        }}
      >
        {status} . {envsNum} Environments
      </Text>
      <hr style={{ margin: '26px 0 0' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#0B35B3',
            padding: '12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          Behavior Graph
        </Button>
        <Button
          type="link"
          style={{
            fontSize: 14,
            lineHeight: '19px',
            color: '#D81E06',
            padding: '12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          onClick={() => {
            setSelectTamplate(id)
          }}
        >
          <img
            src={recordIcon}
            style={{
              width: 24,
              height: 24,
              marginRight: 7,
            }}
            alt=""
          />
          Click to Record
        </Button>
      </div>
    </div>
  )
}

export default TampletCard
