import React, { useState } from 'react'
import { Table, Button, Drawer, Form, Input } from 'antd'
import { useQuery } from 'react-apollo'
import filterIcon from 'icons/filter.png'
import { RESPONSE_RATE } from './query'

export default () => {
  const studentId = localStorage.getItem('studentId')
  const [filterDrawer, setFilterDrawer] = useState(false)

  const { data, loading } = useQuery(RESPONSE_RATE, {
    variables: {
      studentId,
    },
  })

  const columns = [
    {
      key: 'targetName',
      title: 'Target name',
      dataIndex: 'targetName',
    },
    {
      key: 'perTar',
      title: 'Per Target',
      dataIndex: 'perTar',
    },
    {
      key: 'sessionDate',
      title: 'Sesion Date',
      dataIndex: 'sessionDate',
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 5 }}>
        <Button type="link" onClick={() => setFilterDrawer(true)}>
          <img style={{ width: 30, height: 30 }} src={filterIcon} alt="filter icon" />
        </Button>
      </div>

      <Table columns={columns} dataSource={data?.responseRate} bordered loading={loading} />

      <Drawer
        visible={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        width={440}
        title="Filter Result"
      >
        <div style={{ padding: '0px 30px' }}>
          <Form>
            <Form.Item>
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}
