/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import moment, { duration } from 'moment'
import LoadingComponent from 'components/LoadingComponent'

function Index(props) {
  const staff = props.staffProfile
  const [dateList, setDateList] = useState(null)
  const [tt, setTt] = useState(null)

  useEffect(() => {
    if (staff && staff.attendanceSet) {
      let temp = []
      let dates = []
      let temp2 = []

      temp = staff.attendanceSet.edges.map(item => item.node)
      dates = staff.attendanceSet.edges.map(item => moment(item.node.checkIn).format('YYYY-MM-DD'))

      dates.sort((a, b) => moment(b) - moment(a))

      let gg = dates.reduce(function(groups, item) {
        const val = moment(item).format('YYYY-MM-DD')
        groups.includes(val) ? null : groups.push(val)
        return groups
      }, [])

      setDateList(gg)

      temp2.push({})

      for (let i = 0; i < temp.length; i++) {
        let item = temp[i]
        if (item.checkIn) {
          let t1 = moment(item.checkIn)
          let t2 = item.checkOut
            ? moment(item.checkOut)
            : moment(moment(item.checkIn).format('YYYY-MM-DD')).add(19, 'hours')

          let duration = moment.duration(t2.diff(t1))
          let hours = Math.abs(Number(duration.asHours()).toFixed(1))

          temp2[0] = {
            ...temp2[0],
            [moment(temp[i].checkIn).format('DD MMM YYYY')]: hours,
          }
        }
      }
      temp2[0].key = Math.random()
      setTt(temp2)
    }
  }, [staff])

  if (!dateList) {
    return <LoadingComponent />
  }

  const columns = [
    {
      title: 'Title',
      render: row => <span>{staff.name}</span>,
    },
    ...dateList?.map(item => {
      return {
        title: `${moment(item).format('DD MMM YYYY')}`,
        dataIndex: moment(item).format('DD MMM YYYY'),
      }
    }),
  ]

  const tableHeader = (
    <div>
      <span style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}>Attendance</span>
    </div>
  )

  return (
    <div className="view-staff">
      <Table
        title={() => {
          return tableHeader
        }}
        columns={columns}
        dataSource={tt}
        bordered
        pagination={false}
        scroll={{ x: 125 * dateList.length }}
      />
    </div>
  )
}

export default Index
