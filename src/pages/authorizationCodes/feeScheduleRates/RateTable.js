import { PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Table } from 'antd'
import { defaultColumnProps } from 'components/PayorsAndBilling/Common/utils'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import Highlighter from 'react-highlight-words'
import AddFee from './AddFee'
import EditFee from './EditFee'
import ExportData from './ExportData'
import { GET_CODES, GET_FEE_SCHEDULE_RATES, GET_MODIFIER_GROUPS, GET_PAYORS } from './query'

const RatesTable = () => {
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [showForm, setShowForm] = useState('')
  const [feeScheduleList, setFeeScheduleList] = useState([])
  const [modifierList, setModifierList] = useState([])
  const [codeList, setCodeList] = useState([])
  const [payorList, setPayorList] = useState([])
  const [feeProfile, setFeeProfile] = useState(null)
  const [modifierProfile, setModifierProfile] = useState(null)

  const [appliedFilters, setFilters] = useState({
    code: ['all'],
  })
  const [appliedSorting, setSorting] = useState({})

  const { data: feeScheduleRates, loading, error, refetch: refetchRates } = useQuery(
    GET_FEE_SCHEDULE_RATES,
  )
  const { data: codes } = useQuery(GET_CODES)
  const { data: modifiers } = useQuery(GET_MODIFIER_GROUPS)
  const { data: payors } = useQuery(GET_PAYORS)

  useEffect(() => {
    if (feeScheduleRates) {
      const nodes = feeScheduleRates.getFeeScheduleRates.edges.map(({ node }) => {
        return node
      })
      setFeeScheduleList(nodes)
    }
    if (codes) {
      const nodes = codes.getAuthorizationCodes.edges.map(({ node }) => {
        return node
      })
      setCodeList(nodes)
    }
    if (payors) {
      const nodes = payors.getPayors.edges.map(({ node }) => {
        return node
      })
      setPayorList(nodes)
    }
    if (modifiers) {
      const items = modifiers.getModifierGroups.map(item => {
        return item
      })
      setModifierList(items)
    }
  }, [feeScheduleRates, payors, modifiers, refetchRates])

  const handleFilterAndSorting = (pagination, filters, sorter) => {
    setSorting(sorter)
    if (filters) {
      // Handle default filters from here
      if (filters.code && filters.code.length === 1) {
        updateFilterValues('code', filters.code[0])
      }
    }
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // Handle custom filters using here
    confirm()
    setFilters({
      ...appliedFilters,
      [dataIndex]: selectedKeys[0],
    })
  }

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters()
    const existingFilters = appliedFilters
    if (existingFilters[dataIndex]) delete existingFilters[dataIndex]
    setFilters(existingFilters)
  }

  const updateFilterValues = (columnKey, newValue) => {
    const updatedFilters = appliedFilters
    updatedFilters[columnKey] = [newValue]
    console.log('updatedFilters', updatedFilters)
    setFilters(updatedFilters)
  }

  const columnCommonProps = [appliedFilters, appliedSorting, handleSearch, handleReset]
  const columns = [
    {
      ...defaultColumnProps('Payor Name', 'payor.firstname', 'payorName', ...columnCommonProps),
      render: (text, row) =>
        appliedFilters.payorName ? (
          <Button
            onClick={() => openInEditMode(row)}
            type="link"
            style={{ padding: '0px', fontWeight: 'bold' }}
          >
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[appliedFilters.payorName]}
              autoEscape
              textToHighlight={`${row.payor.firstname} ${row.payor.lastname ?? ''}`}
            />
          </Button>
        ) : (
          <Button
            onClick={() => openInEditMode(row)}
            type="link"
            style={{ padding: '0px', fontWeight: 'bold' }}
          >
            {`${row.payor.firstname} ${row.payor.lastname ?? ''}`}
          </Button>
        ),
    },
    {
      ...defaultColumnProps('Service code', 'code.code', 'code', ...columnCommonProps, true),
      filterMultiple: false,
      filters: [
        { text: 'All', value: 'all' },
        ...codeList.map(({ code }) => ({
          text: code,
          value: code,
        })),
      ],
      filteredValue: appliedFilters.code || null,
      onFilter: (value, record) => {
        if (value === 'all') return true
        return record.code.code === value
      },
      render: text =>
        appliedFilters.code ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[appliedFilters.code[0]]}
            autoEscape
            textToHighlight={text}
          />
        ) : (
          text
        ),
    },
    {
      ...defaultColumnProps('Rate', 'rate', 'rate', ...columnCommonProps),
      align: 'right',
    },
    {
      ...defaultColumnProps('Agreed Rate', 'agreedRate', 'agreedRate', ...columnCommonProps),
      align: 'right',
    },
  ]

  const openInEditMode = e => {
    setFeeProfile(e)
    setShowForm('Edit')
    setShowRightDrawer(true)
  }

  const handleRightDrawerClose = () => {
    setShowRightDrawer(false)
    refetchRates()
    // setSelectStatus('all')
    // refetchActive()
    // refetchInactive()
  }

  const getModifiers = data => {
    let nodes = []
    if (data.modifierRates) nodes = data.modifierRates.edges.map(({ node }) => node)
    return nodes
  }

  const header = currentPageData => (
    <div className="header">
      <span className="pageTitle">Fee Schedule List</span>

      <div className="right-align">
        <ExportData data={currentPageData} />
        <Button
          onClick={() => {
            setShowForm('Add')
            setShowRightDrawer(true)
          }}
          type="primary"
          size="small"
        >
          <PlusOutlined /> ADD FEE SCHEDULE
        </Button>
      </div>
    </div>
  )

  const expandedRowRender = row => {
    const modifierRows = getModifiers(row) ?? []
    const innerColumns = [
      { title: 'Modifier Name', dataIndex: 'modifier.name', key: 'modifierName' },
      { title: 'Rate', dataIndex: 'rate', key: 'rate', align: 'right' },
      { title: 'Aggreed Rate', dataIndex: 'agreedRate', key: 'agreedRate', align: 'right' },
    ]

    return (
      <Table
        dataSource={modifierRows}
        columns={innerColumns}
        bordered
        showHeader
        pagination={false}
        size="small"
      />
    )
  }

  return (
    <>
      <Drawer
        title={showForm === 'Add' ? 'ADD FEE SCHEDULE' : 'EDIT FEE SCHEDULE'}
        width="65%"
        placement="right"
        onClose={handleRightDrawerClose}
        visible={showRightDrawer}
      >
        {showForm === 'Add' && (
          <AddFee
            closeDrawer={handleRightDrawerClose}
            feeScheduleRate={feeScheduleList}
            codeList={codeList}
            modifiers={modifierList}
            payorList={payorList}
          />
        )}
        {showForm === 'Edit' && (
          <EditFee
            closeDrawer={handleRightDrawerClose}
            key={feeProfile?.id}
            feeProfile={feeProfile}
            codeList={codeList}
            modifiers={modifierList}
            payorList={payorList}
          />
        )}
      </Drawer>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      <div style={{ margin: '5px', marginBottom: '50px' }}>
        <Table
          loading={loading}
          className="feeRatesTable"
          rowKey="id"
          columns={columns}
          dataSource={feeScheduleList}
          pagination={{
            position: 'both',
            showSizeChanger: true,
            pageSizeOptions: ['3', '10', '25', '50', '100'],
          }}
          size="small"
          expandedRowRender={expandedRowRender}
          expandRowByClick
          bordered
          onChange={handleFilterAndSorting}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          title={header}
        />
      </div>
    </>
  )
}

export default RatesTable
