/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
import React, { useEffect } from 'react'
import { Typography, Tag, Button, notification } from 'antd'
import { ClockCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { ABC } from './query'

const { Title, Text } = Typography

const DELETE_ABC = gql`
  mutation($id: ID!) {
    deleteAbcdata(input: { pk: $id }) {
      status
      message
    }
  }
`

const ABCCard = ({
  style,
  time,
  environment,
  behavior,
  id,
  date,
  setUpdateAbc,
  node,
  refetchAbc,
  openDrawer,
}) => {
  const studentId = localStorage.getItem('studentId')

  const [deleteAbc, { data: deleteData, error: deleteError, loading: deleteLoading }] = useMutation(
    DELETE_ABC,
    {
      variables: {
        id,
      },
      update(cache) {
        const cacheData = cache.readQuery({
          query: ABC,
          variables: {
            studentId,
            date,
          },
        })
        cache.writeQuery({
          query: ABC,
          variables: {
            studentId,
            date,
          },
          data: {
            getABC: {
              edges: cacheData.getABC.edges.filter(({ node }) => node.id !== id),
              __typename: 'ABCDataTypeConnection',
            },
          },
        })
      },
    },
  )

  useEffect(() => {
    if (deleteData) {
      notification.success({
        message: 'Delete Abc data sucessfully',
      })
      refetchAbc()
    }
    if (deleteError) {
      notification.error({
        message: 'Delete Abc data failed',
      })
    }
  }, [deleteData, deleteError])
  const conBinefunc = () => {
    setUpdateAbc(node)
    openDrawer()
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
          <div>
            <Title
              style={{
                fontSize: 16,
              }}
            >
              <span>Behaviors: </span>
              {behavior?.map(({ node }) => (
                <Tag key={node.id}>{node.behaviorName}</Tag>
              ))}
            </Title>
            <Title
              style={{
                fontSize: 16,
              }}
            >
              <span>Evironment: </span>
              <Tag>{environment?.name}</Tag>
            </Title>
          </div>

          <div style={{ position: 'absolute', right: '0' }}>
            <Button
              type="link"
              onClick={() => conBinefunc()}
              style={{
                color: '#584f4f',
                padding: 0,
              }}
            >
              <FaEdit style={{ fontSize: 22 }} />
            </Button>
            <Button
              type="link"
              onClick={() => {
                deleteAbc()
              }}
              style={{
                minWidth: 'fit-content',
                color: '#584f4f',
              }}
              loading={deleteLoading}
            >
              <MdDelete style={{ fontSize: 22 }} />
            </Button>
          </div>
        </div>
        <Text style={{ fontSize: 14 }}>{time}</Text>
      </div>
    </div>
  )
}

export default ABCCard
