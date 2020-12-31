/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-unneeded-ternary */

import React from 'react'
import { Row, Col, Card, Button, Typography, Affix, Table } from 'antd'
import { connect } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { gql } from 'apollo-boost'
import reqwest from 'reqwest'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DataTable from 'react-data-table-component'
import client from '../../apollo/config'

var moment = require('moment')

const { Title, Text } = Typography

const columns = [
  {
    name: 'Domain',
    fixed: 'left',
    selector: 'targetId',
    cell: row => <span>{row.targetId ? row.targetId.domain.domain : 'Other'}</span>,
    maxWidth: '100px',
  },
  {
    name: 'Target Name',
    selector: 'targetAllcatedDetails',
    cell: row => (
      <span>{row.targetAllcatedDetails ? row.targetAllcatedDetails.targetName : ''}</span>
    ),
    maxWidth: '150px',
  },
  {
    name: 'Stimulus',
    selector: 'sd',
    cell: row => (
      <span>
        {row.sd.edges
          ? row.sd.edges.map(tag => {
              return tag.node.sd
            })
          : ''}
      </span>
    ),
    maxWidth: '150px',
  },
  {
    name: 'Steps',
    selector: 'steps',
    cell: row => (
      <span>
        {row.steps.edges
          ? row.steps.edges.map(tag => {
              return tag.node.step
            })
          : ''}
      </span>
    ),
    maxWidth: '150px',
  },
  {
    name: 'Baseline Date',
    selector: 'targetAllcatedDetails',
    cell: row => (
      <span>
        {row.targetAllcatedDetails
          ? moment(row.targetAllcatedDetails.dateBaseline).format('YYYY-MM-DD')
          : ''}
      </span>
    ),
    maxWidth: '150px',
  },
  {
    name: 'In-Therapy Date',
    selector: 'intherapyDate',
    cell: row => <span>{row.intherapyDate ? row.intherapyDate : ''}</span>,
    maxWidth: '150px',
  },
  {
    name: 'Mastery date',
    selector: 'masterDate',
    cell: row => <span>{row.masterDate ? row.masterDate : ''}</span>,
    maxWidth: '100px',
  },
]

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const fileExtension = '.xlsx'

class Report extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
    }
  }

  componentWillMount() {
    const { pagination } = this.state
    this.fetch({ pagination })
  }

  componentDidUpdate(prevProps) {
    const { pagination } = this.state
    let {
      start_date,
      end_date,
      selectedprogram,
      domainSelected,
      statusselected,
      studentIdSelected,
    } = this.props
    start_date = moment(start_date).format('YYYY-MM-DD')
    end_date = moment(end_date).format('YYYY-MM-DD')
    if (
      start_date != prevProps.start_date ||
      end_date != prevProps.end_date ||
      selectedprogram != prevProps.selectedprogram ||
      domainSelected != prevProps.domainSelected ||
      statusselected != prevProps.statusselected ||
      studentIdSelected != prevProps.studentIdSelected
    ) {
      this.fetch({ pagination })
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    })
  }

  fetch = (params = {}) => {
    let { start_date, end_date, selectedprogram, domainSelected, statusselected } = this.props

    start_date = moment(start_date).format('YYYY-MM-DD')
    end_date = moment(end_date).format('YYYY-MM-DD')
    const studentId = localStorage.getItem('studentId')
    client
      .query({
        query: gql`{
          domainMastered(studentId: ${studentId}, dateGte:"${start_date}", dateLte:"${end_date}", programArea:"${selectedprogram}", targetStatus:"${statusselected}")
          {
          totalCount
          target {
              id
              targetId
              {
                  domain
                  {
                      id
                      domain
                  }
              }
              sd {
                  edges {
                  node {
                      id
                      sd
                  }
                  }
              }
              steps {
                  edges {
                  node {
                      id
                      step
                  }
                  }
              }
              targetAllcatedDetails
              {
                  targetName
                  dateBaseline
              }
              intherapyDate
              masterDate
          }
          }
      }`,
        fetchPolicy: 'network-only',
      })
      .then(result => {
        let tableData = []
        if (domainSelected && result.data.domainMastered.target) {
          result.data.domainMastered.target.map(item => {
            if (item.targetId && item.targetId.domain.domain === domainSelected) {
              tableData.push(item)
            }
            return tableData
          })
        } else {
          tableData = result.data.domainMastered.target
        }
        this.setState({
          loading: false,
          data: tableData,
          pagination: {
            ...params.pagination,
            total: result.data.domainMastered.totalCount,
          },
        })
      })
  }

  exportToCSV = studentName => {
    const filename = '_progress_overview_excel'
    let formattedData = this.state.data.map(function(e) {
      return {
        Domain: e.targetId ? e.targetId.domain.domain : 'Other',
        Target_Name: e.targetAllcatedDetails.targetName,
        Stimulus: e.sd.edges
          ? e.sd.edges.map(tag => {
              return tag.node.sd
            })
          : '',
        Steps: e.steps.edges
          ? e.steps.edges.map(tag => {
              return tag.node.step
            })
          : '',
        Baseline_Date: e.targetAllcatedDetails
          ? moment(e.targetAllcatedDetails.dateBaseline).format('YYYY-MM-DD')
          : '',
        In_Therapy_Date: e.intherapyDate ? e.intherapyDate : '',
        Mastery_date: e.masterDate ? e.masterDate : '',
      }
    })

    const ws = XLSX.utils.json_to_sheet(formattedData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const excelData = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(excelData, studentName + filename + fileExtension)
  }

  render() {
    const textStyle = {
      fontSize: '16px',
      lineHeight: '19px',
    }

    const customStyles = {
      header: {
        style: {
          maxHeight: '50px',
        },
      },
      headRow: {
        style: {
          borderTopStyle: 'solid',
          borderTopWidth: '1px',
          borderTopColor: '#ddd',
          backgroundColor: '#f5f5f5',
        },
      },
      headCells: {
        style: {
          '&:not(:last-of-type)': {
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: '#ddd',
          },
          fontWeight: 'bold',
        },
      },
      cells: {
        style: {
          '&:not(:last-of-type)': {
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: '#ddd',
          },
          fontSize: '11px',
        },
      },
      pagination: {
        style: {
          position: 'absolute',
          top: '7px',
          right: '0px',
          borderTopStyle: 'none',
          minHeight: '35px',
        },
      },
      table: {
        style: {
          paddingBottom: '40px',
          top: '40px',
        },
      },
    }

    const { data, pagination, loading } = this.state
    console.log('result.data table ===> ', data)

    return (
      <>
        <DataTable
          columns={columns}
          theme="default"
          dense={true}
          pagination={true}
          data={data}
          customStyles={customStyles}
          noHeader={true}
          width="100px"
          paginationRowsPerPageOptions={[10, 50, 100, 200, 500, 1000]}
        />
      </>
    )
  }
}

export default Report
