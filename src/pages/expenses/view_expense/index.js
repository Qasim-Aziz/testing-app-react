/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable */

import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import DataTable from 'react-data-table-component'
import {
  Table,
  Button,
  Card,
  Avatar,
  Select,
  Input,
  Icon,
  Drawer,
  Switch,
  Dropdown,
  Menu,
  Radio,
  Tag,
} from 'antd'
import JsPDF from 'jspdf'
// import 'jspdf-autotable'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  FilterOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  DownOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
// imports for supporting files
import EditBasicInformation from './EditBasicInformation'
import CreateExpense from '../createExpense'
import './style.scss'

// Setting the styles
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
      height: '40px',
      padding: '12px 8px 12px',
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
      padding: '6px 8px',
      fontSize: '12px',
    },
  },
  pagination: {
    style: {
      position: 'absolute',
      top: '-4px',
      right: '5px',
      borderTopStyle: 'none',
      minHeight: '35px',
    },
  },
  table: {
    style: {
      paddingBottom: '16px',
      top: '16px',
    },
  },
}

const customSpanStyle = {
  backgroundColor: '#52c41a',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inActiveSpanStyle = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '3px',
  padding: '1px 5px',
}
const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }
const tableFilterStyles = { margin: '0px 32px 0 8px' }
const customLabel = {
  fontSize: '17px',
  color: '#000',
  marginRight: '12px',
  marginBottom: '12px',
}

@connect(({ user, expenses }) => ({ user, expenses }))
class ExpenseTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    UserProfile: null,
    realLeaderList: [],
    tableData: [],
    mainData: [],
    isFilterActive: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    filterCategory: '',
    // for create learner drawer
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    filterStatus: 'all', // 'In_progress',
    noOfRows: 10,
    filterItemName: '',
    filterPurchaseFrom: '',
    filterPaidBy: 'all', // instead of tags, we have project-name
  }

  filterRef = React.createRef()

  filterSet = {
    itemName: true,
    purchaseFrom: true,
    status: true,
    amount: true, // filterProject in the local-state
    paidBy: true,
  }

  componentDidMount() {
    console.log(`LETS SEE ALL PROPS \n `, this.props)
    console.log(`LETS SEE ALL state \n `, this.state)
    const { dispatch } = this.props
    dispatch({
      type: 'expenses/GET_DATA',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.expenses !== this.props?.expenses) {
      console.log('UPDATED EXPENSES', this.props.expenses.ExpensesList)
      this.setState({
        mainData: this.props.expenses.ExpensesList,
        tableData: this.props.expenses.ExpensesList,
      })

      if (this.props.expenses.ExpenseCreate === 'Created') {
        this.setState({
          visible: false,
        })
      }
    }
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
    })
  }

  info = e => {
    const { dispatch } = this.props
    // setting leader id to local storage for further operations
    localStorage.setItem('ExpenseId', JSON.stringify(e.id))

    dispatch({
      type: 'expenses/SET_STATE',
      payload: {
        SpecificExpense: e,
        isSpecificExpense: true,
      },
    })
    this.setState({
      divShow: true,
    })
    this.showEditDrawer()
  }

  showEditDrawer = () => {
    this.setState({
      visibleEdit: true,
    })
  }

  onCloseEdit = () => {
    this.setState({
      visibleEdit: false,
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  /* BELOW CODE IS COMMENTED SINCE I PROBABLY WONT BE USING IT */
  selectActiveStatus = value => {
    const {
      dispatch,
      expenses: { ItemPerPage },
    } = this.props
    let isActive = null

    if (value === 'all') isActive = true
    if (value === 'PENDING') isActive = null
    if (value === 'COMPLETED') isActive = null
    if (value === 'CREATED') isActive = null

    dispatch({
      type: 'expenses/SET_STATE',
      payload: {
        CurrentStatus: value,
      },
    })

    dispatch({
      type: 'expenses/GET_EXPENSES',
      payload: {
        isActive,
        first: ItemPerPage,
        after: null,
        before: null,
      },
    })
  }

  filterHandler = ({ itemName, purchaseFrom }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    console.log('Expense filter', itemName, purchaseFrom)
    if (!itemName && !purchaseFrom) {
      tempFilterActive = false
    }
    if (itemName) {
      tempFilterActive = true
      console.log('THE filteredList', filteredList)
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          console.log('WHAT ITEMS', itemName)
          return item.itemName?.toLowerCase().includes(itemName.toLowerCase())
        })
    }
    if (purchaseFrom) {
      console.log('purchaseFrom', purchaseFrom)
      tempFilterActive = true
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          console.log('THE ITEM', item)
          return (
            item.purchaseFrom &&
            item.purchaseFrom.toLowerCase().includes(purchaseFrom.toLowerCase())
          )
        })
    }
    this.setState({
      tableData: filteredList,
      isFilterActive: tempFilterActive,
    })
  }

  clearFilter = () => {
    this.filterHandler({
      itemName: '',
      purchaseFrom: '',
      projectName: '',
      amount: '',
      paid_by: '',
      status: 'all',
    })
    this.selectActiveStatus('all')
  }

  render() {
    console.log('THE PROPS IN EXPENSES initially (render) \n', this.props)
    console.log('THE STATE IN EXPENSES initially (render) \n', this.state)
    let { filteredInfo, visibleFilter, realLearnerList } = this.state

    filteredInfo = filteredInfo || {}
    const {
      expenses: {
        loading,
        ExpensesList,
        isSpecificExpense,
        SpecificExpense,
        TotalExpenses,
        loadingExpenses,
      },
    } = this.props

    let filteredList = this.state.tableData
    console.log('FILTEREDLIST', filteredList)

    if (this.state.filterStatus) {
      console.log('FILTER-STATUS in expense', this.state.filterStatus)
      /**Instead of changing the state I will store the value of state in a local-variable */
      let local_status = this.state.filterStatus
      if (local_status === 'all') {
        //this.state.filterStatus = ''
        local_status = ''
      }

      filteredList =
        filteredList &&
        filteredList.filter(item => {
          // console.log('Filtering by lead-status', item)
          return item.status && item.status.toLowerCase().includes(local_status.toLowerCase())
        })
    }
    if (this.state.filterPaidBy) {
      let local_paidBy = this.state.filterPaidBy
      if (local_paidBy === 'all') {
        local_paidBy = ''
      }
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          // console.log('Filtering by lead-status', item)
          return item.paidBy && item.paidBy.toLowerCase().includes(local_paidBy.toLowerCase())
        })
    }

    const { divShow, filterShow } = this.state
    const divClass = divShow ? 'col-sm-12' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'block', paddingLeft: '0' } : { display: 'none' }

    const columns = [
      {
        title: '#',
        render: row => filteredList.indexOf(row) + 1,
      },
      {
        title: 'ItemName',
        // selector: 'itemName',
        sortable: true,
        // maxWidth: '120px',
        render: row => {
          row.itemName === null ? <span> </span> : <></>

          return (
            <Button
              onClick={() => this.info(row)} // this.info(row)
              type="link"
              style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
            >
              {row.itemName}
            </Button>
          )
        },
      },
      {
        title: 'purchaseFrom',
        // selector: 'purchaseFrom',
        // maxWidth: '120px',
        render: row => {
          return <span>{row.purchaseFrom ? row.purchaseFrom : ''} </span>
        },
      },
      {
        title: 'Amount',
        // selector: 'amount',
        // maxWidth: '120px',
        render: row => {
          // console.log('ROW', row.phone)
          return <span>{row.amount ? row.amount : ''} </span>
        },
      },
      {
        title: 'Paid By',
        // selector: 'paidBy',
        // maxWidth: '120px',
        render: row => <span>{row.paidBy ? row.paidBy : ''} </span>,
      },
      {
        title: 'Status',
        // selector: 'status',
        // maxWidth: '120px',
        render: row => <span>{row.status ? row.status : ''}</span>,
      },
    ]

    const exportPDF = () => {
      console.log('PRINT TO PDF FUNCTIONALITY')
    }

    const exportToCSV = () => {
      console.log('PRINT TO EXCEL SHEET FUNCTIONALITY')
    }

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Button onClick={() => exportPDF()} type="link" size="small">
            PDF
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={() => exportToCSV()} type="link" size="small">
            CSV/Excel
          </Button>
        </Menu.Item>
      </Menu>
    )

    const tableHeader = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          whiteSpace: 'nowrap',
          zIndex: 2,
          width: 'fit-content',
          paddingTop: '4px',
        }}
      >
        {/* Search bar for itemName */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Name :</span>
          <Input
            size="small"
            name="itemName"
            placeholder="Search Name"
            value={this.state.filterItemName}
            onChange={e => {
              this.setState({
                filterItemName: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ itemName: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '112px' }}
          />
        </span>
        {/* Search bar for Purchased From */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Purchased From :</span>
          <Input
            size="small"
            name="purchaseFrom"
            placeholder="Purchased From"
            value={this.state.filterPurchaseFrom}
            onChange={e => {
              this.setState({
                filterPurchaseFrom: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ purchaseFrom: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '148px' }}
          />
        </span>

        {/* Different kinds of status */}
        <span style={{ display: 'flex', alignItems: 'center', padding: '7px' }}>
          <span>STATUS :</span>
          <Select
            placeholder="Status"
            // allowClear
            value={this.state.filterStatus}
            onChange={e => {
              console.log('-----------------------------------------------', e)
              this.selectActiveStatus(e)
              this.setState({ filterStatus: e, isFilterActive: true })
            }}
            style={{ width: '120px' }}
          >
            <Select.Option value="PENDING">PENDING</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
            <Select.Option value="CREATED">CREATED</Select.Option>
          </Select>
        </span>
        {/* Different kinds of Paid By values */}
        <span style={{ display: 'flex', alignItems: 'center', padding: '7px' }}>
          <span>PAID BY :</span>
          <Select
            placeholder="Status"
            // allowClear
            value={this.state.filterPaidBy}
            onChange={e => {
              console.log('-----------------------------------------------', e)
              this.selectActiveStatus(e)
              this.setState({ filterPaidBy: e, isFilterActive: true })
            }}
            style={{ width: '120px' }}
          >
            <Select.Option value="CASH">CASH</Select.Option>
            <Select.Option value="CHEQUE">CHEQUE</Select.Option>
            <Select.Option value="CARD">CARD</Select.Option>
          </Select>
        </span>
      </div>
    )

    return (
      <>
        <Helmet title="Expenses" />
        {/* DRAWER FOR CREATE EXPENSES */}
        <Drawer
          title="CREATE EXPENSE"
          width="80%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateExpense CloseDrawer={this.onClose} />
        </Drawer>
        {/* END OF CREATE EXPENSES DRAWER */}

        {/* DRAWER FOR EDIT-EXPENSES */}
        <Drawer
          title="EDIT EXPENSE"
          width="80%"
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {SpecificExpense ? (
            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body">
                <div id="basic_form_div" style={{ marginTop: '100px' }}>
                  {isSpecificExpense ? <EditBasicInformation key={SpecificExpense.id} /> : null}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Drawer>
        {/* END OF DRAWER FOR EDIT_EXPENSES */}
        {/* ***************** DIV FOR TOP_BAR ***************** */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 10px',
            backgroundColor: '#FFF',
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          {/* Div is used to position the stuff inside it on the left-side  */}
          <div style={{ padding: '5px 0px' }}>
            {/* The filter icon on the top-left side of top bar  */}
            {/* <Button onClick={() => this.showDrawerFilter()} size="large">
              <FilterOutlined />
            </Button> */}
            {/* The below section is when someone adds filters a clear-filter button gets displayed */}
            {this.state.isFilterActive ? (
              <Button
                type="link"
                onClick={() => {
                  this.filterRef.current ? this.filterRef.current.clearFilter() : this.clearFilter()
                  this.setState({
                    isFilterActive: false,
                    filterStatus: 'all', //'',
                    filterPaidBy: 'all',
                    filterItemName: '',
                    filterPurchaseFrom: '',
                  })
                }}
                style={{ marginLeft: '10px', color: '#FEBB27' }}
                size="small"
              >
                Clear Filters
                <CloseCircleOutlined />
              </Button>
            ) : null}
          </div>
          {/* On the top you can see the Title of page */}
          <div>
            <span style={{ fontSize: '25px', color: '#000' }}>Expense List</span>
          </div>
          {/* This div comprise of downloading stuff & button on the top right */}
          <div style={{ padding: '5px 0px' }}>
            {/* This is the blue button to the right-side of add Learners to download table in pdf or excel form */}
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>
            {/* This is the blue button to add Learners */}
            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD EXPENSE
            </Button>
          </div>
        </div>
        {/* ********************** END of DIV FOR TOP_BAR***************** */}

        {/* ************* DIV FOR DATA-TABLE ************ */}
        <div>
          <div style={{ marginBottom: '50px' }}>
            <div className="view_expense">
              <Table
                title={() => {
                  return tableHeader
                }}
                columns={columns}
                rowKey={record => record.id}
                dataSource={filteredList}
                loading={loadingExpenses} // this.state.loadingExpenses
                // ⭐ The below commented code is for pagination from server side
                /* pagination={{
                   defaultPageSize: 20,
                   onChange: (page, rows) => this.pageChanged(page, rows),
                   onShowSizeChange: (currentPage, currentRowsPerPage) =>
                   this.rowsChanged(currentRowsPerPage, currentPage),
                   showSizeChanger: true,
                   pageSizeOptions:
                     TotalLeaders > 100
                       ? ['20', '50', '80', '100', `${TotalLeaders}`]
                       : ['20', '50', '80', '100'],
                   position: 'bottom',
                  }}
                */
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default ExpenseTable

/**
 <div className="modify-data-table">
  <DataTable
    title="Expense Table"
    columns={columns}
    theme="default"
    dense={true}
    key="id"
    keyField="id"
    pagination={true}
    data={filteredList}
    customStyles={customStyles}
    noHeader={true}
    progressPending={loadingExpenses}
    // paginationServer={true}
    // paginationTotalRows={TotalExpenses}
    // onChangePage={(page, rows) => this.pageChanged(page, rows)}
    paginationServerOptions={{
      persistSelectedOnPageChange: false,
      persistSelectedOnSort: false,
    }}
    // onChangeRowsPerPage={(currentRowsPerPage, currentPage) =>
    //   this.rowsChanged(currentRowsPerPage, currentPage)
    // }
    // paginationRowsPerPageOptions={
    //   TotalExpenses > 100 ? [10, 20, 50, 80, 100, TotalExpenses] : [10, 20, 50, 80, 100]
    // }
    currentPage={2}
  />
</div> 
 */
