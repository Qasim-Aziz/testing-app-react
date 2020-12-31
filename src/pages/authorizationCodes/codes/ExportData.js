import React from 'react'
import { Button, Dropdown, Menu } from 'antd'
import { CloudDownloadOutlined } from '@ant-design/icons'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

const exportToCSV = data => {
  const fileName = 'authorizationCodes_excel'
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'
  const formattedData = data.map(function(e) {
    return {
      Code: e.code,
      Description: e.description,
      CodeType: e.codeType.name,
      School: e.school.schoolName,
      Payor: e.payor.firstname,
      CalculationType: e.calculationType.name,
      Billable: e.billabe ? 'Billable' : 'Non-billable',
      DefaultUnits: e.defaultUnits.unit,
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
  const title = 'Authorization Code List'
  const headers = [
    [
      'Code',
      'Description',
      'Code Type',
      'School',
      'Payor',
      'Calculation Type',
      'Type',
      'Default Units',
    ],
  ]

  const exportData = data.map(e => [
    e.code,
    e.description,
    e.codeType.name,
    e.school.schoolName,
    e.payor.firstname,
    e.calculationType.name,
    e.billabe ? 'Billable' : 'Non-billable',
    e.defaultUnits.unit,
  ])

  const content = {
    startY: 50,
    head: headers,
    body: exportData,
  }

  doc.text(title, 10, 10)
  doc.autoTable(content)
  doc.setFontSize(10)
  doc.save('authorizationCodes.pdf')
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
