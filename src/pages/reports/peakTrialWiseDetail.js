/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react'
import { Table, Row, Tooltip } from 'antd'
import './form.scss'
import './table.scss'

function PeakTrialDetails({ target, block }) {
  const [tableData, setTableData] = useState([])
  const [trialArr, setTrialArr] = useState([])

  useEffect(() => {
    const tempTrial = []
    const tempTable = []
    if (block) {
      tempTable.push({
        sd: target,
        target,
      })
      block?.map((item, trialIdx) => {
        tempTrial.push(trialIdx + 1)
        let isOld = false
        let objIdx = -1
        for (let i = 0; i < tempTable.length; i += 1) {
          if (item.node.sd.sd === tempTable[i].sd) {
            isOld = true
            objIdx = i
          }
        }

        if (!isOld) {
          tempTable.push({
            sd: item.node.sd.sd,
            key: item.node.sd.sd,
            [`Trial ${trialIdx + 1}`]: item.node.marks,
            aggregate: item.node.marks,
          })
        } else {
          tempTable[objIdx] = {
            ...tempTable[objIdx],
            [`Trial ${trialIdx + 1}`]: item.node.marks,
            aggregate: tempTable[objIdx].aggregate + item.node.marks,
          }
        }
      })
    }
    setTrialArr(tempTrial)
    setTableData(tempTable)
  }, [block])

  const col = [
    {
      title: 'Target',
      dataIndex: 'sd',
      key: 'sd',
      width: 250,
      fixed: 'left',
      render: (text, row) => {
        if (row?.target) {
          if (text?.length > 35) {
            return (
              <Tooltip title={text}>
                <span>{text.slice(0, 35)}...</span>
              </Tooltip>
            )
          }
          return <span style={{ fontWeight: '600' }}>{text}</span>
        }
        return <span style={{ color: '#F080B8' }}>{text}</span>
      },
    },
    ...trialArr.map(item => {
      return {
        title: `Trial ${item}`,
        dataIndex: `Trial ${item}`,
        align: 'center',
      }
    }),
    {
      title: 'Aggregate',
      dataIndex: 'aggregate',
      align: 'right',
      width: 80,
      fixed: 'right',
    },
  ]

  return (
    <div style={{ marginTop: '50px' }} className="peak-block-detail-table">
      <Row style={{ marginTop: '10px' }}>
        <Table
          dataSource={tableData}
          rowKey="sd"
          size="small"
          bordered
          pagination={false}
          columns={col}
          scroll={{ x: trialArr.length * 100 }}
        />
      </Row>
    </div>
  )
}

export default PeakTrialDetails
