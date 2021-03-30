/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Table, Row, Tooltip } from 'antd'
import groupObj from '@hunters/group-object'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import './form.scss'
import './table.scss'
import { COLORS } from 'assets/styles/globalStyles'

export const PeakStimulusReport = forwardRef((props, ref) => {
  const { peakBlockData, peakBlockLoading, dates, studentName } = props
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (peakBlockData) {
      const tempTable = []

      let groupedData = groupObj.group(peakBlockData, 'target')
      let keys = Object.keys(groupedData)
      keys.map(target => {
        tempTable.push({
          key: target,
          parent: true,
          target,
          children: [],
        })

        groupedData[target].map(item => {
          if (item.blocks?.length > 0) {
            let tempTotalTrials = 0
            let tempAggregate = 0
            for (let bb = 0; bb < item?.blocks?.length; bb += 1) {
              const trialItem = item.blocks && item.blocks[bb]
              const tableObj = tempTable[tempTable.length - 1]
              const trialObj = trialItem.trial?.edges

              for (let i = 0; i < trialObj.length; i += 1) {
                let exist = false
                let idx = -1
                const child = tableObj.children
                tempTotalTrials += 1
                tempAggregate += trialObj[i].node.marks
                for (let j = 0; j < child.length; j += 1) {
                  if (child[j].target === trialObj[i].node.sd.sd) {
                    exist = true
                    idx = j
                  }
                }

                if (!exist) {
                  tempTable[tempTable.length - 1].children.push({
                    key: trialObj[i].node.sd.sd,
                    target: trialObj[i].node.sd.sd,
                    [`${item.date}`]: {
                      totalTrials: 1,
                      aggregate: trialObj[i].node.marks,
                    },
                  })
                } else if (
                  exist &&
                  !tempTable[tempTable.length - 1].children[idx][`${item.date}`]
                ) {
                  tempTable[tempTable.length - 1].children[idx] = {
                    ...tempTable[tempTable.length - 1].children[idx],
                    [`${item.date}`]: {
                      totalTrials: 1,
                      aggregate: trialObj[i].node.marks,
                    },
                  }
                } else if (exist && tempTable[tempTable.length - 1].children[idx][`${item.date}`]) {
                  tempTable[tempTable.length - 1].children[idx][`${item.date}`] = {
                    totalTrials:
                      1 + tempTable[tempTable.length - 1].children[idx][`${item.date}`].totalTrials,
                    aggregate:
                      trialObj[i].node.marks +
                      tempTable[tempTable.length - 1].children[idx][`${item.date}`].aggregate,
                  }
                }
              }
            }
            if (tempTable[tempTable.length - 1][`${item.date}`]) {
              tempTable[tempTable.length - 1][`${item.date}`].totalTrials += tempTotalTrials
              tempTable[tempTable.length - 1][`${item.date}`].aggregate += tempAggregate
            } else {
              tempTable[tempTable.length - 1] = {
                ...tempTable[tempTable.length - 1],
                [`${item.date}`]: {
                  totalTrials: tempTotalTrials,
                  aggregate: tempAggregate,
                },
              }
            }
          }
        })
      })
      setTableData(tempTable)
    }
  }, [peakBlockData])

  const col = [
    {
      title: 'Targets',
      dataIndex: 'target',
      width: 280,
      fixed: 'left',
      render: (text, row) => {
        if (!row.parent) {
          return <span style={{ color: COLORS.stimulus }}>{text}</span>
        }
        if (text.length > 35) {
          return (
            <Tooltip title={text}>
              <span>{text.slice(0, 35)}...</span>
            </Tooltip>
          )
        }
        return text
      },
    },
    ...dates?.map(item => {
      return {
        title: `${item.dayDate}  ${item.month}`,
        children: [
          {
            title: 'Total Trials',
            dataIndex: `${item.date}.totalTrials`,
            align: 'center',
          },
          {
            title: 'Aggregate',
            dataIndex: `${item.date}.aggregate`,
            align: 'center',

            render: (text, row) => {
              if (text && row[item.date]) {
                return `${text}/${row[item.date].totalTrials * 10}`
              }
              return text
            },
          },
        ],
      }
    }),
  ]

  const getFormattedObj = (data, parentTarget) => {
    let tempObj = {
      target: data.parent ? data.target : `${parentTarget}-${data.target}`,
    }
    dates.map(item => {
      if (data[item.date]) {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: `${data[item.date]?.aggregate} / ${data[item.date]?.totalTrials * 10}`,
        }
      } else {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: null,
        }
      }
    })

    return tempObj
  }

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  useImperativeHandle(ref, () => ({
    exportToCSV(reportType) {
      if (reportType === 'Stimulus/dir') {
        const filename = `${studentName?.trim()}_peak_stimulus_report`
        const formattedData = []

        for (let i = 0; i < tableData.length; i += 1) {
          const obj = tableData[i]
          const tempObj = getFormattedObj(obj)
          formattedData.push(tempObj)
          if (obj.children) {
            obj.children.map(child => {
              formattedData.push(getFormattedObj(child, obj.target))
            })
          }
        }
        console.log(formattedData, filename, 'ftd')
        const ws = XLSX.utils.json_to_sheet(formattedData)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const excelData = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(excelData, filename + fileExtension)
      }
    },
  }))

  return (
    <div className="peak-block-report">
      <Row>
        <Table
          columns={col}
          bordered
          expandRowByClick
          loading={peakBlockLoading}
          scroll={{ x: 200 * dates.length }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            position: 'bottom',
          }}
          dataSource={tableData}
        />
      </Row>
    </div>
  )
})
