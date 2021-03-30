/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/prefer-default-export */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Table, Tooltip } from 'antd'
import groupObj from '@hunters/group-object'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import './form.scss'
import './table.scss'
import { COLORS } from 'assets/styles/globalStyles'

export const PeakBlockEqui = forwardRef((props, ref) => {
  const { studentName, peakEquiData, peakEquiLoading, dates, expandType } = props
  const [tableData, setTableData] = useState([])

  const iterateTrials = (tarIdx, tempTable, item) => {
    item.equBlocks.map(block => {
      let stimExist = false
      let stimIdx = -1
      let tempStimulus = block.codeClass.name
      if (expandType === 'Stimulus') {
        if (
          block.recType === 'TRAIN' &&
          block.relationTrain.stimulus1 &&
          block.relationTrain.stimulus2
        ) {
          tempStimulus = `${block.relationTrain.stimulus1}${block.relationTrain.sign12}${block.relationTrain.stimulus2}`
        } else if (
          block.recType === 'TRAIN' &&
          block.relationTrain.stimulus2 &&
          block.relationTrain.stimulus3
        ) {
          tempStimulus = `${block.relationTrain.stimulus2}${block.relationTrain.sign23}${block.relationTrain.stimulus3}`
        } else if (
          block.recType === 'TEST' &&
          block.relationTest.stimulus1 &&
          block.relationTest.stimulus2
        ) {
          tempStimulus = `${block.relationTest.stimulus1}${block.relationTest.sign12}${block.relationTest.stimulus2}`
        } else if (
          block.recType === 'TEST' &&
          block.relationTest.stimulus2 &&
          block.relationTest.stimulus3
        ) {
          tempStimulus = `${block.relationTest.stimulus2}${block.relationTest.sign23}${block.relationTest.stimulus3}`
        }
      }

      for (let i = 0; i < tempTable[tarIdx].children.length; i++) {
        if (tempTable[tarIdx].children[i].target === tempStimulus) {
          stimExist = true
          stimIdx = i
        }
      }
      if (stimExist) {
        if (tempTable[tarIdx].children[stimIdx][item.date]) {
          tempTable[tarIdx].children[stimIdx][item.date] += block.score
        } else {
          tempTable[tarIdx].children[stimIdx][item.date] = block.score
        }
      } else {
        tempTable[tarIdx].children.push({
          target: tempStimulus,
          key:
            expandType === 'Stimulus'
              ? block.recType === 'TRAIN'
                ? block.relationTrain.id
                : block.relationTest.id
              : block.codeClass.id,
          [item.date]: block.score,
          recType: block.recType,
          type: expandType,
        })
      }
      if (tempTable[tarIdx][item.date]) {
        tempTable[tarIdx][item.date] += block.score
      } else {
        tempTable[tarIdx][item.date] = block.score
      }
    })
  }

  useEffect(() => {
    if (peakEquiData) {
      const tempTable = []

      const groupedData = groupObj.group(peakEquiData, 'targetName')
      const keys = Object.keys(groupedData)

      keys.map((target, index) => {
        groupedData[target].map(item => {
          let tarExist = false
          let tarIdx = -1
          for (let i = 0; i < tempTable.length; i++) {
            if (tempTable[i].target === target) {
              tarExist = true
              tarIdx = i
            }
          }

          if (tarExist) {
            iterateTrials(tarIdx, tempTable, item)
          } else {
            tempTable.push({
              target,
              key: item.targetId,
              [item.date]: 0,
              children: [],
              type: 'target',
            })

            iterateTrials(tempTable.length - 1, tempTable, item)
          }
        })
      })
      setTableData(tempTable)
    }
  }, [peakEquiData])

  const columns = [
    {
      title: 'Target',
      dataIndex: 'target',
      width: '280px',
      fixed: 'left',
      render: (text, row) => {
        if (row.type === 'Stimulus') {
          return <span style={{ color: COLORS.stimulus }}>{text}</span>
        }
        if (row.type === 'Class') {
          return <span style={{ color: COLORS.class }}>{text}</span>
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
            dataIndex: `${item.date}`,
            align: 'center',
          },
        ],
      }
    }),
  ]

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const getFormattedObj = (data, parentTarget) => {
    let tempObj = {
      target: data.type === 'target' ? data.target : `${parentTarget}-${data.target}`,
    }

    dates.map(item => {
      if (data[item.date]) {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: data[item.date],
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
      if (reportType === 'Class' || reportType === 'Stimulus') {
        const filename = `${studentName.trim()}_peak_Equ_report_${reportType}Wise`
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
    <div>
      <Table
        className="peak-block-report"
        columns={columns}
        dataSource={tableData}
        bordered
        expandRowByClick
        loading={peakEquiLoading}
        scroll={{ x: 104 * dates.length }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          position: 'bottom',
        }}
      />
    </div>
  )
})
