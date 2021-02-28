import React from 'react'
import { Input, Button } from 'antd'

const FilterDropDown = ({
  columnTitle,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  dataIndex,
  onSearch,
  onReset,
}) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder={`Search ${columnTitle}`}
      value={selectedKeys[0]}
      onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
      autoFocus
    />
    <Button
      type="primary"
      onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
      icon="search"
      size="small"
      style={{ width: 90, marginRight: 8 }}
    >
      Search
    </Button>
    <Button onClick={() => onReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
      Reset
    </Button>
  </div>
)

export default FilterDropDown
