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
import 'jspdf-autotable'
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
import CreateAsset from '../createAsset'
import './style.scss'

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

@connect(({ user, assets }) => ({ user, assets }))
class AssetTable extends React.Component {
  state = {
    divShow: false,
    filterShow: false,
    isLoaded: true,
    SpecificAsset: null, // 👈👉 UserProfile (in Leader)
    realAssetList: [],
    tableData: [],
    mainData: [],
    isFilterActive: false,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    filterCategory: '',
    // for create asset drawer
    visible: false,
    visibleEdit: false,
    visibleFilter: false,
    filterStatus: 'all', // 'In_progress',
    noOfRows: 10,
    filterAssetName: '',
    // filterPurchaseFrom: '',
    // filterPaidBy: 'all', // instead of tags, we have project-title
  }

  filterRef = React.createRef()

  filterSet = {
    assetName: true,
    // description: true,
    assetStatus: true,
  }

  componentDidMount() {
    console.log(`LETS SEE ALL PROPS \n `, this.props)
    console.log(`LETS SEE ALL state \n `, this.state)
    const { dispatch } = this.props
    dispatch({
      type: 'assets/GET_DATA',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.assets !== this.props?.assets) {
      console.log('UPDATED AssetS', this.props.assets.AssetsList)
      this.setState({
        mainData: this.props.assets.AssetsList,
        tableData: this.props.assets.AssetsList,
      })

      if (this.props.assets.AssetCreate === 'Created') {
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
    // setting asset id to local storage for further operations
    localStorage.setItem('AssetId', JSON.stringify(e.id))

    dispatch({
      type: 'assets/SET_STATE',
      payload: {
        SpecificAsset: e,
        isSpecificAsset: true,
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
    console.log('THE VALUES ------------ ➡ ', value)
    const {
      dispatch,
      assets: { ItemPerPage },
    } = this.props
    let isActive = null

    if (value === 'all') isActive = true
    if (value === 'ASSIGNED') isActive = null
    if (value === 'NOT_ASSIGNED') isActive = null

    dispatch({
      type: 'assets/SET_STATE',
      payload: {
        CurrentStatus: value,
      },
    })

    dispatch({
      type: 'assets/GET_ASSETS',
      payload: {
        isActive,
        first: ItemPerPage,
        after: null,
        before: null,
      },
    })
  }

  filterHandler = ({ title }) => {
    let filteredList = this.state.mainData
    let tempFilterActive = false
    console.log('Expense filter', title)
    if (!title) {
      tempFilterActive = false
    }
    if (title) {
      tempFilterActive = true
      console.log('THE filteredList', filteredList)
      filteredList =
        filteredList &&
        filteredList.filter(item => {
          console.log('WHAT ITEMS', item)
          return item.assetName?.toLowerCase().includes(title.toLowerCase())
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
      status: 'all',
    })
    this.selectActiveStatus('all')
  }

  render() {
    console.log('THE PROPS IN ASSETS initially (render) \n', this.props)
    console.log('THE STATE IN ASSETS initially (render) \n', this.state)
    let { filteredInfo, visibleFilter, realAssetList } = this.state

    filteredInfo = filteredInfo || {}
    const {
      assets: {
        loading,
        AssetsList,
        // UsersList,
        isSpecificAsset,
        SpecificAsset,
        TotalAssets,
        loadingAssets,
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
        filteredList =
          filteredList &&
          filteredList.filter(item => {
            // console.log('Filtering by asset-status', item)
            return (
              item.assetStatus &&
              item.assetStatus.toLowerCase().includes(local_status.toLowerCase())
            )
          })
      } else {
        filteredList =
          filteredList &&
          filteredList.filter(item => {
            // console.log('Filtering by asset-status', item)
            return (
              item.assetStatus === local_status //&& item.assetStatus.toLowerCase().includes(local_status.toLowerCase())
            )
          })
      }
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
        title: 'Asset Name',
        // selector: 'assetName',
        sortable: true,
        // maxWidth: '120px',
        render: row => {
          row.assetName === null ? <span> </span> : <></>

          return (
            <Button
              onClick={() => this.info(row)} // this.info(row)
              type="link"
              style={{ padding: '0px', fontWeight: 'bold', fontSize: '11px' }}
            >
              {row.assetName}
            </Button>
          )
        },
      },
      {
        title: 'Description',
        // selector: 'description',
        // maxWidth: '120px',
        render: row => {
          return <span>{row.description ? row.description : ''} </span>
        },
      },
      {
        title: 'Asset Status',
        // selector: 'assetStatus',
        // maxWidth: '120px',
        render: row => {
          return <span>{row.assetStatus ? row.assetStatus : ''} </span>
        },
      },
      {
        title: 'Created At',
        // selector: 'createdAt',
        // maxWidth: '120px',
        render: row => {
          return <span>{row.createdAt ? row.createdAt : ''} </span>
        },
      },
      {
        title: 'Updated At',
        // selector: 'updatedAt',
        // maxWidth: '120px',
        render: row => {
          return <span>{row.updatedAt ? row.updatedAt : ''} </span>
        },
      },
      {
        title: 'Created By',
        // selector: 'createdBy',
        // maxWidth: '120px',
        render: row => {
          let object_of_assigned_by = row.createdBy
          // console.log('THE OBJ ====👉', object_of_assigned_by)
          if (object_of_assigned_by) {
            // console.log('object_of_assigned_by', object_of_assigned_by.assignedBy)
            return (
              <span>
                {object_of_assigned_by.firstName} {object_of_assigned_by.lastName}
              </span>
            )
          } else {
            return <>NULL</>
          }
        },
      },
      {
        title: 'Assigned By',
        // selector: 'assignedBy',
        // maxWidth: '120px',
        render: row => {
          // console.log(
          //   '*******************',
          //   row.assetdesignationmodelSet,
          //   row.assetdesignationmodelSet.length,
          // )
          let object_of_assigned_by = row.assetdesignationmodelSet[0]
          // console.log('THE OBJ ====👉', object_of_assigned_by)
          if (object_of_assigned_by) {
            // console.log('object_of_assigned_by', object_of_assigned_by.assignedBy)
            return (
              <span>
                {object_of_assigned_by.assignedBy.firstName}{' '}
                {object_of_assigned_by.assignedBy.lastName}
              </span>
            )
          } else {
            // console.log(
            //   '------------------------------>',
            //   row.assetdesignationmodelSet,
            //   row.assetdesignationmodelSet.length,
            // )
            return <>NULL</>
          }
        },
      },
      {
        title: 'Assigned To',
        // selector: 'assignedTo',
        // maxWidth: '120px',
        render: row => {
          // console.log(
          //   'ASSIGNED TO *******************',
          //   row.assetdesignationmodelSet,
          //   row.assetdesignationmodelSet.length,
          // )
          let object_of_assigned_to = row.assetdesignationmodelSet[0]
          // console.log('THE OBJ ====> ▶', object_of_assigned_to)
          if (object_of_assigned_to) {
            // console.log('object_of_assigned_to', object_of_assigned_to.assignedTo)
            return (
              <span>
                {object_of_assigned_to.assignedTo.firstName}{' '}
                {object_of_assigned_to.assignedTo.lastName}
              </span>
            )
          } else {
            // console.log(
            //   '------------------------------>',
            //   row.assetdesignationmodelSet,
            //   row.assetdesignationmodelSet.length,
            // )
            return <>NULL</>
          }
        },
      },
    ]
    // ****************************** PDF & CSV ******************************
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
          height: '28px',
          width: '100%',
          padding: '4px 12px',
        }}
      >
        {/* Search bar for title */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>Name :</span>
          <Input
            size="small"
            title="title"
            placeholder="Search Name"
            value={this.state.filterName}
            onChange={e => {
              this.setState({
                filterName: e.target.value,
                isFilterActive: e.target.value && true,
              })
              this.filterHandler({ title: e.target.value })
            }}
            style={{ ...tableFilterStyles, width: '112px' }}
          />
        </span>
        {/* Different kinds of status */}
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span>STATUS :</span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={this.state.filterStatus}
            onChange={e => {
              // this.selectActiveStatus(e.target.value)
              this.setState({ filterStatus: e.target.value, isFilterActive: true })
            }}
            style={tableFilterStyles}
          >
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="ASSIGNED">ASSIGNED</Radio.Button>
            <Radio.Button value="NOT_ASSIGNED">NOT_ASSIGNED</Radio.Button>
          </Radio.Group>
        </span>
      </div>
    )

    // ****************************** PDF & CSV ******************************
    console.log('END OF RENDER HELLO PROPS', this.props)
    console.log('END OF RENDER ALL STATE', this.state)
    // let filteredList = this.state.

    return (
      <>
        {console.log(`LETS SEE ALL PROPS \n `, this.props)}
        {console.log(`LETS SEE ALL state \n `, this.state)}
        <Helmet title="Assets" />
        {/* DRAWER FOR FILTER */}
        {/* ------------------------------------ */}
        {/* END OF DRAWER FOR FILTER */}

        {/* DRAWER FOR Create-ASSET  */}
        <Drawer
          title="CREATE ASSET"
          width="75%"
          placement="right"
          closable={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <CreateAsset CloseDrawer={this.onClose} />
        </Drawer>
        {/* END OF DRAWER FOR CREATE-ASSET */}

        {/* DRAWER FOR EDIT-ASSET */}
        <Drawer
          title="EDIT ASSET"
          width="80%"
          placement="right"
          closable={true}
          onClose={this.onCloseEdit}
          visible={this.state.visibleEdit}
        >
          {/* Once the drawer is visible the "SpecificAsset"(defined in the local-state)
              will set with the details of that particular Asset.
              • And the form values will be set to that user's details
          */}
          {SpecificAsset ? (
            /* The entire drawer is a card */

            <div className="card" style={{ marginTop: '5px', border: 'none' }}>
              <div className="card-body">
                <div>
                  {/* id="basic_form_div" style={{ marginTop: '100px' }} */}
                  {isSpecificAsset ? <EditBasicInformation key={SpecificAsset.id} /> : null}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </Drawer>
        {/* END OF DRAWER FOR EDIT-ASSET */}

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
                    filterName: '',
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
            <span style={{ fontSize: '25px', color: '#000' }}>Assets List</span>
          </div>
          {/* This div comprise of downloading stuff & button on the top right */}
          <div style={{ padding: '5px 0px' }}>
            {/* This is the blue button to the right-side of add assets to download table in pdf or excel form */}
            <Dropdown overlay={menu} trigger={['click']}>
              <Button style={{ marginRight: '10px' }} type="link">
                <CloudDownloadOutlined />{' '}
              </Button>
            </Dropdown>
            {/* This is the blue button to add assets */}
            <Button onClick={this.showDrawer} type="primary">
              <PlusOutlined /> ADD ASSET
            </Button>
          </div>
        </div>
        {/* ********************** END of DIV FOR TOP_BAR***************** */}
        <div>
          {/* ************* DIV FOR DATA-TABLE ************ */}
          <div style={{ marginBottom: '50px' }}>
            <div className="view_asset">
              <Table
                title={() => {
                  return tableHeader
                }}
                columns={columns}
                rowKey={record => record.id}
                dataSource={filteredList}
                loading={loadingAssets} // this.state.loadingAssets
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

export default AssetTable
