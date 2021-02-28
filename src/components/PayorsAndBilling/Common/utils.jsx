/* eslint-disable import/prefer-default-export */
import React from 'react'
import { Icon } from 'antd'
import Highlighter from 'react-highlight-words'
import _ from 'lodash'
import FilterDropDown from './FilterDropDown'

const defaultColumnProps = (
  columnTitle,
  columnIndex,
  columnKey,
  filters,
  sorters,
  onSearch,
  onReset,
  removeFilters,
) => {
  const columnProps = {
    title: columnTitle,
    dataIndex: columnIndex,
    key: columnKey,
    sorter: (a, b) => {
      const val1 = _.get(a, columnIndex, '')
      const val2 = _.get(b, columnIndex, '')

      // Numeric comparison
      if (typeof val1 === 'number') return val1 - val2

      // String comparison
      return val1.localeCompare(val2)
    },
    sortOrder: sorters.columnKey === columnKey && sorters.order,
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    render: text =>
      filters[columnIndex] ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[filters[columnIndex]]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  }

  if (!removeFilters) {
    columnProps.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <FilterDropDown
        columnTitle={columnTitle}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        confirm={confirm}
        clearFilters={clearFilters}
        dataIndex={columnIndex}
        onSearch={onSearch}
        onReset={onReset}
      />
    )
    columnProps.onFilter = (value, record) =>
      _.get(record, columnKey, '')
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
  }

  return columnProps
}

const getResponsibilities = requiredAll => {
  const responsibilities = []
  if (requiredAll) responsibilities.push('All', 'N/A')
  responsibilities.push('Primary', 'Secondary', 'Tertiary')
  return responsibilities
}

export { defaultColumnProps, getResponsibilities }
