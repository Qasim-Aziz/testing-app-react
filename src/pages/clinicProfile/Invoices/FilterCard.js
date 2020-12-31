import React from 'react'
import { Select, DatePicker, Typography } from 'antd'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

const { Option } = Select

const STATUS = gql`
  query {
    invoiceStatusList {
      id
      statusName
      colorCode
    }
  }
`

const { Text } = Typography
const { MonthPicker } = DatePicker

export default ({ form, setForm, to, setTo, statusSelect, setStatusSelect, month, setMonth }) => {
  const { data: statusData, loading: statusLoading } = useQuery(STATUS)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: 24,
        paddingTop: 30,
        paddingRight: 34,
      }}
    >
      <div>
        <Text style={{ display: 'block', fontSize: 18 }}>By Status:</Text>
        <Select
          style={{ width: 200 }}
          size="large"
          placeholder="Filter by status"
          value={statusSelect}
          onChange={value => setStatusSelect(value)}
          allowClear
          loading={statusLoading}
        >
          {statusData?.invoiceStatusList.map(({ id, statusName }) => (
            <Option key={id} value={id}>
              {statusName}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex' }}>
        <span>
          <Text style={{ display: 'inline-block', fontSize: 18 }}>From:</Text>
          <br />
          <DatePicker value={form} onChange={newDate => setForm(newDate)} />
        </span>

        <span>
          <Text style={{ display: 'inline-block', fontSize: 18, marginLeft: 20 }}>To:</Text>
          <br />
          <DatePicker value={to} onChange={newDate => setTo(newDate)} style={{ marginLeft: 20 }} />
        </span>
      </div>

      <div>
        <Text style={{ display: 'block', fontSize: 18 }}>By Month:</Text>
        <MonthPicker
          placeholder="Select A Month"
          value={month}
          onChange={newMonth => {
            setMonth(newMonth)
          }}
        />
      </div>
    </div>
  )
}
