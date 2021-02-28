/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */

import React from 'react'
import { Typography, notification, Table } from 'antd'
import { gql } from 'apollo-boost'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import client from '../../apollo/config'

const columns = [
  {
    title: 'Domain',
    dataIndex: 'targetId',
    render: (text, row) => <span>{row.targetId ? row.targetId.domain.domain : 'Other'}</span>,
  },
  {
    title: 'Target Name',
    dataIndex: 'targetAllcatedDetails',
    ellipsis: true,
    width: '320px',
    render: (text, row) => (
      <span>{row.targetAllcatedDetails ? row.targetAllcatedDetails.targetName : ''}</span>
    ),
  },
  {
    title: 'Stimulus',
    dataIndex: 'sd',
    render: (text, row) => (
      <span>
        {row.sd.edges
          ? row.sd.edges.map(tag => {
              return tag.node.sd
            })
          : ''}
      </span>
    ),
  },
  {
    title: 'Steps',
    dataIndex: 'steps',
    render: (text, row) => (
      <span>
        {row.steps.edges
          ? row.steps.edges.map(tag => {
              return tag.node.step
            })
          : ''}
      </span>
    ),
  },
  {
    title: 'Baseline Date',
    dataIndex: 'targetAllcatedDetails',
    render: (text, row) => (
      <span>
        {row.targetAllcatedDetails
          ? moment(row.targetAllcatedDetails.dateBaseline).format('YYYY-MM-DD')
          : ''}
      </span>
    ),
    width: '130px',
  },
  {
    title: 'In-Therapy Date',
    dataIndex: 'intherapyDate',
    render: (text, row) => <span>{row.intherapyDate ? row.intherapyDate : ''}</span>,
    width: '130px',
  },
  {
    title: 'Mastery date',
    dataIndex: 'masterDate',
    render: (text, row) => <span>{row.masterDate ? row.masterDate : ''}</span>,
    width: '110px',
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
          domainMastered(studentId: ${studentId},
             dateGte:"${start_date}", 
             dateLte:"${end_date}", 
             programArea:"${selectedprogram}", 
             targetStatus:"${statusselected}")
          {
          totalCount
          target {
              id
              targetId
              {
                id
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
                id
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
      .catch(error => {
        error.graphQLErrors.map(item => {
          return notification.error({
            message: 'Somthing went wrong',
            description: item.message,
          })
        })
      })
  }

  exportToCSV = studentName => {
    const filename = '_progress_overview_excel'
    // eslint-disable-next-line no-unused-expressions
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

    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100', '200', '500'],
            position: 'top',
          }}
        />
      </>
    )
  }
}

export default Report
