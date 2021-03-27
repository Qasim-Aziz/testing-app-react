/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Collapse, Table, Button, Drawer, Select, DatePicker, notification } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import groupObj from '@hunters/group-object'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { COLORS } from 'assets/styles/globalStyles'
import ResponseRateGraph from './dailyResponseRateGraph'
import './form.scss'
import './table.scss'

export const ResponseRateEqui = forwardRef((props, ref) => {
  const {
    studentName,
    type,
    status,
    daysList,
    equiData,
    equiError,
    peakEquiLoading,
    peakEquiFilData,
  } = props
  const [selectTarget, setSelectTarget] = useState()
  const studentId = localStorage.getItem('studentId')
  const [lineDrawer, setLineDrawer] = useState(false)
  const [graphData, setGraphData] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (equiData) {
      console.log(equiData, 'equi')
    } else if (equiError) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch equivalence targets',
      })
    }
  }, [equiData, equiError])

  useEffect(() => {
    if (equiData) {
      filterData()
    }
  }, [type, status, peakEquiFilData])

  const loadData = equiData => {
    if (equiData && peakEquiFilData) {
      const tempTable = []
      const groupEquiData = groupObj.group(equiData, 'targetName')
      const groupPeakEquiDetails = groupObj.group(peakEquiFilData, 'targetName')
      const keys = Object.keys(groupEquiData)
      const expandType = 'Stimulus'

      keys.map(target => {
        tempTable.push({
          target,
          key: target,
          type: 'target',
          targetStatusName: groupEquiData[target][0].targetStatusName,
          targetType: groupEquiData[target][0].targetType,
          children: [],
        })
        const tarIdx = tempTable.length - 1

        groupPeakEquiDetails[target].map(item => {
          item.equBlocks.map(tt => {
            let stimExist = false
            let stimIdx = -1
            let tempStimulus = tt.codeClass.name
            if (expandType === 'Stimulus') {
              if (
                tt.recType === 'TRAIN' &&
                tt.relationTrain.stimulus1 &&
                tt.relationTrain.stimulus2
              ) {
                tempStimulus = `${tt.relationTrain.stimulus1}${tt.relationTrain.sign12}${tt.relationTrain.stimulus2}`
              } else if (
                tt.recType === 'TRAIN' &&
                tt.relationTrain.stimulus2 &&
                tt.relationTrain.stimulus3
              ) {
                tempStimulus = `${tt.relationTrain.stimulus2}${tt.relationTrain.sign23}${tt.relationTrain.stimulus3}`
              } else if (
                tt.recType === 'TEST' &&
                tt.relationTest.stimulus1 &&
                tt.relationTest.stimulus2
              ) {
                tempStimulus = `${tt.relationTest.stimulus1}${tt.relationTest.sign12}${tt.relationTest.stimulus2}`
              } else if (
                tt.recType === 'TEST' &&
                tt.relationTest.stimulus2 &&
                tt.relationTest.stimulus3
              ) {
                tempStimulus = `${tt.relationTest.stimulus2}${tt.relationTest.sign23}${tt.relationTest.stimulus3}`
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
                tempTable[tarIdx].children[stimIdx][item.date].total += 1
                tempTable[tarIdx].children[stimIdx][item.date].correctCount +=
                  tt.score === 10 ? 1 : 0
              } else {
                tempTable[tarIdx].children[stimIdx][item.date] = {
                  total: 1,
                  correctCount: tt.score === 10 ? 1 : 0,
                }
              }
            } else {
              tempTable[tarIdx].children.push({
                target: tempStimulus,
                parentTarget: target,
                key:
                  expandType === 'Stimulus'
                    ? tt.recType === 'TRAIN'
                      ? tt.relationTrain.id
                      : tt.relationTest.id
                    : tt.codeClass.id,

                [item.date]: {
                  total: 1,
                  correctCount: tt.score === 10 ? 1 : 0,
                },
                type: expandType,
              })
            }
            if (tempTable[tarIdx][item.date]) {
              tempTable[tarIdx][item.date].total += 1
              tempTable[tarIdx][item.date].correctCount += tt.score === 10 ? 1 : 0
            } else {
              tempTable[tarIdx][item.date] = {
                total: 1,
                correctCount: tt.score === 10 ? 1 : 0,
              }
            }
          })
        })
      })

      console.log(tempTable, 'tempTable')
      setTableData(tempTable)
    }
  }

  const columns = [
    {
      key: 'targetName',
      title: 'Target',
      fixed: 'left',
      width: '350px',
      dataIndex: 'target',
      render: (text, row) => {
        if (row.type === 'target') {
          if (row.children) {
            return (
              <div
                style={{
                  height: '26px',
                  fontSize: '14px',
                  display: 'flex',
                  margin: 'auto 0',
                  width: '100%',
                  color: '#2874A6',
                  fontWeight: '600',
                }}
              >
                {text}
              </div>
            )
          }
          return (
            <div
              style={{
                fontSize: '13px',
                height: '26px',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: '600',
                color: '#2874A6',
              }}
            >
              <div style={{ margin: 'auto 0', padding: 0 }}>{text}</div>

              <Button type="link" onClick={() => handleSelectTarget(row)}>
                <LineChartOutlined
                  style={{ margin: 'auto 0', fontSize: '26px', color: COLORS.graph }}
                />
              </Button>
            </div>
          )
        }

        return (
          <div
            style={{
              display: 'flex',
              height: '26px',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              paddingLeft: '20px',
              color: row.type === 'Stimulus' ? COLORS.stimulus : COLORS.steps,
            }}
          >
            <div style={{ margin: 'auto 0', padding: 0 }}>{text}</div>
            {row.parent ? null : (
              <Button type="link" onClick={() => handleSelectTarget(row)}>
                <LineChartOutlined
                  style={{ fontSize: '26px', margin: 'auto 0', color: 'rgb(229, 132, 37)' }}
                />
              </Button>
            )}
          </div>
        )
      },
    },
    {
      title: 'Target Status',
      dataIndex: 'targetStatusName',
      width: '120px',
      render: text => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: 'Target Type',
      dataIndex: 'targetType',
      width: '150px',
      render: text => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    ...daysList.map(item => {
      return {
        title: `${item.dayDate} ${item.month}`,
        align: 'center',

        children: [
          {
            title: item.day.substring(0, 3),
            align: 'center',
            render: (text, row) => {
              if (row[item.date]) {
                if (row.type === 'target') {
                  return (
                    <span style={{ fontWeight: 600 }}>
                      {Number((row[item.date]?.correctCount / row[item.date]?.total) * 100).toFixed(
                        0,
                      )}
                    </span>
                  )
                }
                return (
                  <span>
                    {Number((row[item.date]?.correctCount / row[item.date]?.total) * 100).toFixed(
                      0,
                    )}
                  </span>
                )
              }
              return null
            },
          },
        ],
      }
    }),
  ]

  const handleSelectTarget = targetName => {
    setSelectTarget(targetName)
    getGraphData(targetName)
  }

  const getGraphData = targetName => {
    console.log(targetName, 'tr')
    const graphAxixData = []
    const groupedData = groupObj.group(daysList, 'monthYear')
    let keys = []
    keys = Object.keys(groupedData)
    console.log(keys, 'kk')

    keys.map(monthYear => {
      const tempData = [
        {
          month: groupedData[monthYear][0].month,
          year: groupedData[monthYear][0].year,
          key: `DailyResponseRate ${groupedData[monthYear][0].month} ${groupedData[monthYear][0].year}`,
          color: 'hsl(335, 70%, 50%)',
          data: [],
        },
      ]

      groupedData[monthYear].map(item => {
        const targetPer = targetName[item.date]
          ? Number(
              (targetName[item.date]?.correctCount / targetName[item.date]?.total) * 100,
            ).toFixed(0)
          : 0
        tempData[0].data.push({
          x: item.dayDate,
          y: targetPer,
          key: item.dayDate,
        })
      })
      graphAxixData.push(tempData)
    })
    console.log(graphAxixData, 'gr')

    setGraphData(graphAxixData)
    setLineDrawer(true)
  }

  const filterData = () => {
    const typeFilterDataList = []
    const statusFilterDataList = []
    if ((type && type.length > 0) || (status && status.length > 0)) {
      if (type && type.length > 0) {
        type.map(targetTypeVal => {
          const filterData = equiData.responseRate.filter(item => item.targetType === targetTypeVal)
          typeFilterDataList.push(...filterData)
        })
        loadData(typeFilterDataList)
      }
      if (status && status.length > 0) {
        if (type && type.length > 0) {
          status.map(statusVal => {
            const filterData = typeFilterDataList.filter(
              item => item.targetStatusName === statusVal,
            )
            statusFilterDataList.push(...filterData)
          })
        } else {
          status.map(statusVal => {
            const filterData = equiData.responseRate.filter(
              item => item.targetStatusName === statusVal,
            )
            statusFilterDataList.push(...filterData)
          })
        }
        loadData(statusFilterDataList)
      }
    } else {
      loadData(equiData.responseRate)
    }
  }

  const getFormattedObj = (data, parentTarget) => {
    let tempObj = {
      target:
        data.type === 'target'
          ? data.target
          : data.type === 'Stimulus'
          ? `${parentTarget}-Stimulus-${data.target}`
          : `${parentTarget}-Step-${data.target}`,
    }
    daysList.map(item => {
      if (data[item.date]) {
        tempObj = {
          ...tempObj,
          [`${item.date}`]: Number(
            Number((data[item.date].correctCount / data[item.date].total) * 100).toFixed(0),
          ),
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
      if (reportType === 'Equivalence') {
        const filename = '_daily_res_exel_Equivalence'
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

        // console.log(formattedData, 'fdff')
        const ws = XLSX.utils.json_to_sheet(formattedData)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const excelData = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(excelData, studentName + filename + fileExtension)
      }
    },
  }))

  return (
    <div>
      <Drawer
        title={`${studentName}'s  -  
       ${
         selectTarget?.type === 'target'
           ? `Target: ${selectTarget?.target}`
           : `Target: ${selectTarget?.parentTarget} - ${
               selectTarget?.type === 'Stimulus' ? 'Stimulus: ' : 'Step: '
             } ${selectTarget?.target}`
       }`}
        visible={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={900}
      >
        <ResponseRateGraph graphData={graphData} />
      </Drawer>
      {peakEquiLoading ? (
        <LoadingComponent />
      ) : tableData.length > 0 ? (
        <div
          key={Math.random()}
          className="response-rate-table"
          style={{ margin: '10px 0px 10px 10px' }}
        >
          <Table
            columns={columns}
            dataSource={tableData}
            bordered
            expandIcon={record => {
              return null
            }}
            pagination={false}
            defaultExpandAllRows={true}
            size="middle"
            scroll={{ x: daysList.length * 100 + 300, y: '1000px' }}
          />
        </div>
      ) : (
        <div style={{ margin: '20px auto', textAlign: 'center' }}>
          No data found, try to remove filter or change date range
        </div>
      )}
    </div>
  )
})
