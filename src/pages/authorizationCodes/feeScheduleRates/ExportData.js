import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

const getModifiers = data => {
  const list = []
  if (data.modifierRates && data.modifierRates.edges.length > 0) {
    const subNodes = data.modifierRates.edges.map(({ node }) => {
      list.push(node.modifier.name)
      return node.modifier.name
    })
  }
  return list
}

const exportToCSV = data => {
  const fileName = 'feeStructureRate_excel'
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const formattedData = data.map(function(row) {
    return {
      Payor: row.payor.firstname,
      Code: row.code.code,
      Rate: row.rate,
      AgreedRate: row.agreedRate,
      Modifier: getModifiers(row).length > 0 ? getModifiers(row).join(' ') : '',
    }
  })

  const ws = XLSX.utils.json_to_sheet(formattedData)
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const exportData = new Blob([excelBuffer], { type: fileType })
  FileSaver.saveAs(exportData, fileName + fileExtension)
}

const exportPDF = data => {
  const unit = 'pt'
  const size = 'A4' // Use A1, A2, A3 or A4
  const orientation = 'landscape' // portrait or landscape
  const doc = new JsPDF(orientation, unit, size)
  const title = 'Fee Schedule Rate List'
  const headers = [['Payor', 'Code', 'Rate', 'AgreedRate', 'Modifier']]

  const exportData = data.map(row => [
    row.payor.firstname,
    row.code.code,
    row.rate,
    row.agreedRate,
    getModifiers(row).length > 0 ? getModifiers(row).join(' ') : '',
  ])

  const content = {
    startY: 50,
    head: headers,
    body: exportData,
  }

  doc.text(title, 10, 10)
  doc.autoTable(content)
  doc.setFontSize(10)
  doc.save('feeStructureRate.pdf')
}

const ExportData = ({ data }) => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Button onClick={() => exportPDF(data)} type="link" size="small">
          PDF
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button onClick={() => exportToCSV(data)} type="link" size="small">
          CSV/Excel
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button style={{ marginRight: '10px' }} type="link" size="large">
          <CloudDownloadOutlined />{' '}
        </Button>
      </Dropdown>
    </>
  )
}

export default ExportData
