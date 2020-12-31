import React, { useState, useEffect } from 'react'
import { PlusOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Drawer, Card, Typography, notification } from 'antd'
import { useSelector } from 'react-redux'
import { useMutation } from 'react-apollo'
// eslint-disable-next-line import/no-cycle
import { LSAG_USER_ID } from './index'
import CreateBlogForm from './CreateBlogForm'
import UpdateGroupForm from './UpdateGroupForm'
import { DELETE_GROUP, GET_GROUPS } from './query'

const { Title, Text } = Typography

export default ({ id, name, description, count, selected, setSelectGroup }) => {
  const userId = useSelector(state => state.user.id)
  const [open, setOpen] = useState(false)
  const [updateGroupDrawer, setUpdateGroupDrawer] = useState(false)

  const [
    deleteGroup,
    { data: deleteGroupData, error: deleteGroupError, loading: deleteGropLoading },
  ] = useMutation(DELETE_GROUP, {
    variables: {
      id,
    },
    update(cache) {
      const cacheData = cache.readQuery({ query: GET_GROUPS })
      cache.writeQuery({
        query: GET_GROUPS,
        data: {
          communityGroups: cacheData.communityGroups.filter(group => group.id !== id),
        },
      })
    },
  })

  useEffect(() => {
    if (deleteGroupData) {
      notification.success({
        message: 'Delete group sucessfully',
      })
    }
    if (deleteGroupError) {
      notification.error({
        message: 'Error to delete group',
      })
    }
  }, [deleteGroupData, deleteGroupError])

  return (
    <Card
      role="presentation"
      style={{
        background: selected ? 'darkorange' : '#fff',
        maxHeight: 221,
        borderRadius: 10,
        border: '1px solid #E4E9F0',
        cursor: 'pointer',
        marginTop: 13,
        position: 'relative',
      }}
      onClick={() => setSelectGroup(id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Title
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            maxWidth: '80%',
            color: selected ? '#fff' : '#000',
          }}
        >
          {name}
        </Title>
        <div>
          {userId === LSAG_USER_ID && (
            <>
              <Button type="link" onClick={() => deleteGroup()} loading={deleteGropLoading}>
                <DeleteOutlined style={{ fontSize: 24, color: selected ? '#fff' : 'red' }} />
              </Button>
              <Button type="link" onClick={() => setUpdateGroupDrawer(true)}>
                <FormOutlined style={{ fontSize: 24, color: selected ? '#fff' : 'blue' }} />
              </Button>
            </>
          )}
          <Button type="link" onClick={() => setOpen(true)}>
            <PlusOutlined
              style={{
                fontSize: 30,
                color: selected ? '#fff' : 'darkblue',
                cursor: 'pointer',
              }}
            />
          </Button>
        </div>
      </div>
      <Text
        style={{
          display: 'block',
          margin: 0,
          marginTop: 11,
          fontSize: '1rem',
          color: selected ? '#fff' : '#E78326',
        }}
      >
        {count} Parents
      </Text>
      <Text
        style={{
          display: 'block',
          margin: 0,
          marginTop: 15,
          fontSize: '1.1rem',
          color: selected ? '#fff' : '#000',
          maxHeight: 80,
          overflow: 'hidden',
        }}
      >
        {description}
      </Text>
      <Drawer title="Create A Blog" width={440} visible={open} onClose={() => setOpen(false)}>
        <div style={{ padding: '0px 30px' }}>
          <CreateBlogForm setOpen={setOpen} groupId={id} />
        </div>
      </Drawer>
      <Drawer
        title="Create A Blog"
        width={440}
        visible={updateGroupDrawer}
        onClose={() => setUpdateGroupDrawer(false)}
      >
        <div style={{ padding: '0px 30px' }}>
          <UpdateGroupForm groupId={id} setOpen={setUpdateGroupDrawer} />
        </div>
      </Drawer>
    </Card>
  )
}
