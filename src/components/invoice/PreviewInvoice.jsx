import React from 'react'
import { Button } from 'antd'
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import 'jspdf-autotable'
import { FilePdfOutlined } from '@ant-design/icons'
import { useQuery } from 'react-apollo'
import LoadingComponent from '../../pages/staffProfile/LoadingComponent'
import { GET_INVOICE } from './query'
import './PreviewInvoice.scss'

const PreviewInvoice = ({ invoiceId }) => {
  const { data: invoiceData, loading: isInvoiceDataLoading, error: invoiceDataErrors } = useQuery(
    GET_INVOICE,
    {
      variables: {
        id: invoiceId,
      },
    },
  )

  const exportPdf = () => {
    html2canvas(document.querySelector('#capture'), { scale: '1' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPDF()
      pdf.addImage(imgData, 'PNG', 10, 0)
      pdf.save('invoice.pdf')
    })
  }

  if (isInvoiceDataLoading) return <LoadingComponent />

  return (
    <div>
      <Button type="link" onClick={() => exportPdf()}>
        Download <FilePdfOutlined />
      </Button>
      <div id="capture">
        <div className="clearfix" id="header">
          <div id="logo">
            <img src="logo.png" alt="logo" />
          </div>
          <div id="company">
            <h2 className="name">Company Name</h2>
            <div>455 Foggy Heights, AZ 85004, US</div>
            <div>(602) 519-0450</div>
            <div>
              <a href="mailto:company@example.com">company@example.com</a>
            </div>
          </div>
        </div>

        <div id="details" className="clearfix">
          <div id="client">
            <div className="to">INVOICE TO:</div>
            <h2 className="name">{invoiceData.invoiceDetail.customer.firstname}</h2>
            <div className="address">{invoiceData.invoiceDetail.address}</div>
            <div className="email">
              <a href="#">{invoiceData.invoiceDetail.email}</a>
            </div>
          </div>
          <div id="invoice">
            <h1>INVOICE {invoiceData.invoiceDetail.invoiceNo}</h1>
            <div className="date">Date of Invoice: {invoiceData.invoiceDetail.issueDate}</div>
            <div className="date">Due Date: {invoiceData.invoiceDetail.dueDate}</div>
          </div>
        </div>
        <table id="invoiceTable" border="0" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="no">#</th>
              <th className="desc">DESCRIPTION</th>
              <th className="total">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.invoiceDetail.invoiceFee?.edges.map(({ node }, index) => (
              <tr key={node.id}>
                <td className="no">{++index}</td> {/* eslint-disable-line no-plusplus */}
                <td className="desc">
                  <h3>{node.schoolServices.name}</h3>
                  {node.schoolServices.description}
                </td>
                <td className="total">{node.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td cellSpan="2"> </td>
              <td cellSpan="2">SUBTOTAL</td>
              <td>{invoiceData.invoiceDetail.amount}.00</td>
            </tr>
            <tr>
              <td cellSpan="2"> </td>
              <td cellSpan="2">GRAND TOTAL</td>
              <td>{invoiceData.invoiceDetail.total}.00</td>
            </tr>
          </tfoot>
        </table>
        <div id="thanks">Thank you!</div>
      </div>
    </div>
  )
}

export default PreviewInvoice
