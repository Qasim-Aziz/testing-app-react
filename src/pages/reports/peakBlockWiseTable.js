/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable import/prefer-default-export */
/* eslint-disable */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Table, Row, Button, Drawer, Tooltip } from 'antd'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import groupObj from '@hunters/group-object'

import PeakTrialDetails from './peakTrialWiseDetail'
import './form.scss'
import './table.scss'
import { COLORS, DRAWER } from 'assets/styles/globalStyles'

const dateFormat = 'YYYY-MM-DD'

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
export const PeakBlockWiseTable = forwardRef((props, ref) => {
  const { peakBlockData, peakBlockLoading, dates, studentName } = props
  const [tableData, setTableData] = useState([])
  const [currentBlock, setCurrentBlock] = useState(null)
  const [blockDetailsDrawer, setBlockDetailsDrawer] = useState(false)

  console.log(peakBlockData, dates, studentName)
  useEffect(() => {
    if (peakBlockData) {
      const tempTable = []

      let groupedData = groupObj.group(peakBlockData, 'target')
      let keys = Object.keys(groupedData)

      keys.map((target, index) => {
        const targetObj = groupedData[target]
        tempTable.push({
          key: target,
          parent: true,
          target,
          children: [],
        })
        targetObj.map(item => {
          if (item.blocks?.length > 0) {
            let tempTotal = 0
            let tempMaxScore = 0
            for (let i = 0; i < item.blocks.length; i += 1) {
              tempTotal += item.blocks[i].totalScore
              tempMaxScore += item.blocks[i].trial ? item.blocks[i].trial.edges.length * 10 : 0

              const childrenArray = tempTable[tempTable.length - 1].children
              if (i < childrenArray.length) {
                if (tempTable[tempTable.length - 1].children[i][`${item.date}`]) {
                  tempTable[tempTable.length - 1].children[i][`${item.date}`].trials.push(
                    item.blocks[i].trial?.edges,
                  )
                  tempTable[tempTable.length - 1].children[i][`${item.date}`].maxScore +=
                    item.blocks[i].trial?.edges?.length * 10
                  tempTable[tempTable.length - 1].children[i][`${item.date}`].score +=
                    item.blocks[i].totalScore
                } else {
                  tempTable[tempTable.length - 1].children[i] = {
                    ...tempTable[tempTable.length - 1].children[i],
                    [`${item.date}`]: {
                      score: item.blocks[i].totalScore,
                      key: item.blocks[i].id,
                      blockName: `Block ${i + 1}`,
                      trials: new Array(item.blocks[i].trial?.edges),
                      maxScore: item.blocks[i].trial?.edges?.length * 10,
                      targetData: item.target,
                      date: item.date,
                    },
                  }
                }
              } else {
                tempTable[tempTable.length - 1].children.push({
                  target: `Block ${i + 1}`,
                  key: `${target} Block ${i + 1}`,
                  [`${item.date}`]: {
                    score: item.blocks[i].totalScore,
                    key: item.blocks[i].id,
                    blockName: `Block ${i + 1}`,
                    trials: new Array(item.blocks[i].trial?.edges),
                    maxScore: item.blocks[i].trial?.edges?.length * 10,
                    targetData: item.target,
                    date: item.date,
                  },
                })
              }
            }
            if (tempTable[tempTable.length - 1][item.date]) {
              tempTable[tempTable.length - 1][item.date].score += tempTotal
              tempTable[tempTable.length - 1][item.date].maxScore += tempMaxScore
            } else {
              tempTable[tempTable.length - 1][item.date] = {
                score: tempTotal,
                maxScore: tempMaxScore,
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
      width: '300px',
      fixed: 'left',
      render: (text, row) => {
        if (!row.parent) {
          return <span style={{ color: COLORS.target }}>{text}</span>
        }
        if (text?.length > 35) {
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
        align: 'center',
        children: [
          {
            title: item.day,
            dataIndex: `${item.date}.score`,
            align: 'center',
            render: (text, row) => {
              let tempText
              if (
                row[item.date] === undefined ||
                row[item.date]?.maxScore === undefined ||
                row[item.date]?.maxScore === 0
              ) {
                tempText = text
              } else {
                tempText = `${text}/${row[item.date].maxScore}`
              }

              if (row.parent) {
                return tempText
              }

              return (
                <span>
                  <Button
                    type="link"
                    style={{
                      padding: 0,
                      fontSize: '13px',
                      width: 'fit-content',
                      height: 'fit-content',
                      border: 'none',
                      margin: 0,
                    }}
                    onClick={() => {
                      setCurrentBlock(row[item.date])
                      setBlockDetailsDrawer(true)
                    }}
                  >
                    {tempText}
                  </Button>
                </span>
              )
            },
          },
        ],
      }
    }),
  ]

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const getFormattedObj = (data, parentTarget) => {
    let tempObj = {
      target: data.parent ? data.target : `${parentTarget}-${data.target}`,
    }

    dates.map(item => {
      if (data[item.date]) {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: `${data[item.date]?.score} / ${data[item.date]?.maxScore}`,
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

  useImperativeHandle(ref, () => ({
    exportToCSV(reportType) {
      if (reportType === 'Block') {
        const filename = `${studentName.trim()}_peak_block_report`
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

  console.log(currentBlock, 'current block')

  return (
    <div className="peak-block-report">
      <Row>
        <Table
          columns={col}
          bordered
          expandRowByClick
          scroll={{ x: 108 * dates.length }}
          loading={peakBlockLoading}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
            position: 'bottom',
          }}
          dataSource={tableData}
        />
      </Row>
      <Drawer
        title={
          <span>
            <b>
              {`${new Date(currentBlock?.date).getDate()}
              ${monthNames[new Date(currentBlock?.date).getMonth()]}'s
              ${currentBlock?.targetData} : 
            `}
            </b>
            {currentBlock?.blockName}
          </span>
        }
        width={DRAWER.widthL2}
        placement="right"
        closable="true"
        onClose={() => setBlockDetailsDrawer(false)}
        visible={blockDetailsDrawer}
        destroyOnClose="true"
      >
        {currentBlock &&
          currentBlock.trials.map(block => {
            return (
              <PeakTrialDetails
                target={currentBlock.targetData}
                key={Math.random()}
                block={block}
              />
            )
          })}
      </Drawer>
    </div>
  )
})
