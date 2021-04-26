/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, notification, Tooltip } from 'antd'
import { PrinterOutlined, FilePdfOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ToWords } from 'to-words'
import { useQuery } from 'react-apollo'
import logo from 'images/WhatsApp Image 2020-04-23 at 10.00.40 (1).jpeg'
import LoadingComponent from 'components/LoadingComponent'
import { GET_INVOICE, GET_PAYMENT_RECIEVING_DETIAILS } from './query'

const general = {
  fontSize: '12px',
  padding: '5px 8px',
  color: 'black',
  fontWeight: '500',
}

const sectionMain = {
  width: '100%',
  border: '1px solid black',
  color: 'black',
}
const section = {
  padding: '8px',
  display: 'flex',
  flexDirection: 'row',
  color: 'black',
  width: '100%',
  borderBottom: '1px solid black',
}
const flexSection = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  padding: '5px 8px',
  textAlign: 'left',
}
const dateSection = {
  width: '40%',
  fontSize: 12,
  alignSelf: 'flex-start',
  textAlign: 'left',
  fontWeight: '500',
}

const rowStyle = {
  borderBottom: '1px solid black',
  display: 'flex',
  float: 'left',
  width: '100%',
  flexDirection: 'row',
}
const qtyCol = {
  ...general,
  display: 'flex',
  width: '18%',
  borderLeft: '1px solid black',
}
const serviceCol = {
  ...general,
  width: '35%',
  borderLeft: '1px solid black',
}
const rightText = { width: '100%', margin: 'auto 0', textAlign: 'right' }
const taxSection = {
  ...general,
  padding: '0',
  alignSelf: 'flex-end',
  textAlign: 'right',
  minWidth: '120px',
}
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getTotal(subTotal, discount = 0, gst = 0, sgst = 0, taxableSubtotal = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(gst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(taxableSubtotal || 0),
  ).toFixed(2)
}

const PreviewInvoice = ({ invoiceId }) => {
  const { data: invoiceData, loading: isInvoiceDataLoading, error: invoiceDataErrors } = useQuery(
    GET_INVOICE,
    {
      variables: {
        id: invoiceId,
      },
    },
  )

  const { data: detailsData, loading: detailsLoading, error: detailsError } = useQuery(
    GET_PAYMENT_RECIEVING_DETIAILS,
  )

  // console.log(invoiceData, isInvoiceDataLoading, invoiceDataErrors, 'invoice Data')
  // console.log(detailsData, detailsLoading, detailsError, 'details')
  const [invoice, setInvoice] = useState(null)
  const [currencyName, setCurrencyName] = useState(null)
  const [subTotal, setSubtotal] = useState(0)
  const history = useHistory()

  console.log(invoiceData, 'invoiceData')
  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData?.invoiceDetail)
      let tempTotal = 0
      invoiceData?.invoiceDetail.invoiceFee.edges.map(item => {
        let am = Number(Number(item.node.quantity * item.node.rate).toFixed(3))
        tempTotal += am
      })
      setSubtotal(tempTotal)
      setCurrencyName('INR')
    }
  }, [invoiceData])

  const toWords = new ToWords({
    localeCode: currencyName === 'INR' ? 'en-IN' : 'en-US',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  })

  const total = 0

  const invoke = () => {
    localStorage.setItem('currentInvoice', JSON.stringify(invoice))
    history.push('/printInvoice')
  }

  useEffect(() => {
    if (detailsError || invoiceDataErrors) {
      return notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch invoice data',
      })
    }
  }, [detailsError, invoiceDataErrors])

  if (isInvoiceDataLoading || detailsLoading || !invoice) return <LoadingComponent />
  if (detailsError || invoiceDataErrors || !invoiceData || !detailsData)
    return (
      <div style={{ marginTop: 80, marginLeft: 60, fontWeight: 700, fontSize: 18 }}>
        Opps, something went wrong
      </div>
    )

  const { ifscCode, bankName, accountHolderName, bankAccountNo } = detailsData?.schoolDetail

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="ant-drawer-header">
        <div
          style={{
            margin: 0,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '22px',
          }}
        >
          {invoice?.invoiceNo}
        </div>
        <Tooltip placement="top" title="Download Pdf">
          <Button
            className=" ant-drawer-close"
            style={{ right: '45px' }}
            type="link"
            onClick={invoke}
          >
            <PrinterOutlined />
          </Button>
        </Tooltip>
      </div>
      <div style={{ margin: '50px auto' }}>
        <div style={{ width: '600px', height: 'fit-content' }}>
          <div style={sectionMain}>
            <div style={{ ...section, height: '100px' }}>
              <img alt="logog" src={logo} style={{ width: '30%', alignSelf: 'center' }} />
              <div
                style={{
                  textAlign: 'center',
                  width: '250px',
                  alignSelf: 'center',
                  fontWeight: '600',
                  marginLeft: '10px',
                  padding: '0 20px',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                  }}
                >
                  {invoice.customer?.school?.schoolName}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  {invoice.customer?.school?.address}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  GSTIN 06AAXCS2626LIZQ
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  width: '200px',
                  alignSelf: 'center',
                  padding: '0 20px',
                }}
              >
                <div>{invoice?.invoiceNo}</div>
              </div>
            </div>
            <div style={{ ...section, height: '120px', padding: '0' }}>
              <div style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> #INV</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.invoiceNo}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> Issue Date</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.issueDate}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> Due Date</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.dueDate}</div>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, width: '40%', fontWeight: '600' }}>
                    Place of supply
                  </div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.address}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderBottom: '1px solid black',
                height: '75px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{ ...general, alignSelf: 'flex-start', width: '100px', fontWeight: '600' }}
                >
                  Bill To
                </div>
                <div style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                  : {invoice.customer?.firstname} {invoice.customer?.lastname}, {invoice.address}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{
                    ...general,
                    paddingTop: 0,
                    alignSelf: 'flex-start',
                    width: '100px',
                    fontWeight: '600',
                  }}
                >
                  Email
                </div>
                <div style={{ ...general, paddingTop: 0, alignSelf: 'flex-start', width: '300px' }}>
                  : {invoice.email}
                </div>
              </div>
            </div>

            <div
              style={{
                borderBottom: '1px solid black',
                height: '65px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  ...general,
                  alignSelf: 'flex-start',
                  width: '100px',
                  fontWeight: '600',
                }}
              >
                Subject
              </div>
              <div style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                : Cogniable Service Invoice for{' '}
                {
                  monthNames[
                    moment(invoice.issueDate)
                      .subtract(1, 'M')
                      .format('MM') - 1
                  ]
                }{' '}
                {new Date(invoice.issueDate).getFullYear()}
              </div>
            </div>
            <div style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
              <div
                style={{
                  ...qtyCol,
                  width: '30px',
                  alignSelf: 'flex-start',
                  borderLeft: 'none',
                  fontWeight: '600',
                }}
              >
                #
              </div>
              <div style={{ ...serviceCol, fontWeight: '600' }}>Service</div>
              <div style={{ ...qtyCol, fontWeight: '600' }}>
                <div style={rightText}>Quantity</div>
              </div>
              <div style={{ ...qtyCol, fontWeight: '600' }}>
                <div style={rightText}>Rate ({currencyName})</div>
              </div>
              <div style={{ ...qtyCol, fontWeight: '600', width: '24%' }}>
                <div style={rightText}>Amount ({currencyName})</div>
              </div>
            </div>
            {invoice.invoiceFee.edges.map((item, index) => {
              const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(2)
              return (
                <div style={rowStyle} key={item.node.id}>
                  <div
                    style={{
                      ...qtyCol,
                      width: '30px',
                      borderLeft: 'none',
                    }}
                  >
                    <div style={{ margin: 'auto' }}>{index + 1}. </div>
                  </div>
                  <div style={serviceCol}>{item.node.schoolServices.name}</div>
                  <div style={qtyCol}>
                    <div style={rightText}>{item.node.quantity}</div>
                  </div>
                  <div style={qtyCol}>
                    <div style={rightText}>{item.node.rate}</div>
                  </div>
                  <div style={{ ...qtyCol, width: '24%' }}>
                    <div style={rightText}>{tempTotal}</div>
                  </div>
                </div>
              )
            })}
            <div
              style={{
                ...rowStyle,
                flexDirection: 'row-reverse',
                backgroundColor: '#fafafa',
              }}
            >
              <div
                style={{
                  ...general,
                  alignSelf: 'flex-end',
                  textAlign: 'right',
                  minWidth: '120px',
                }}
              >
                {subTotal} {currencyName}
              </div>
              <div style={general}>Subtotal :</div>
            </div>
            <div style={{ ...section, padding: '0', borderBottom: 'none' }}>
              <div style={{ width: '50%' }}>
                <div style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                  {toWords.convert(total)}
                </div>
                <div style={{ ...general, alignSelf: 'flex-start', color: 'blue', width: '100%' }}>
                  <a href={invoice.paymentLink} rel="noopener noreferrer" target="_blank">
                    {invoice.paymentLink}
                  </a>
                </div>
                <div
                  style={{
                    ...general,
                    paddingBottom: '1px',
                    alignSelf: 'flex-start',
                    width: '100%',
                  }}
                >
                  <b>Bank A/C No:</b> <span>{bankAccountNo}</span>
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>IFSC Code:</b> {ifscCode}
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>Branch:</b> {bankName}
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>A/C Holder Name:</b> {accountHolderName}
                </div>
              </div>
              <div
                style={{
                  width: '50%',
                  borderLeft: '1px solid black',
                }}
              >
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}{' '}
                    {currencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    Dicount({invoice.discount || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.cgst || 0)).toFixed(2)}{' '}
                    {currencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    CGST({invoice.cgst || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}{' '}
                    {currencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    SGST({invoice.sgst || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.taxableSubtotal || 0)).toFixed(2)}{' '}
                    {currencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    Taxes({invoice.taxableSubtotal || 0}%) :
                  </div>
                </div>
                <div style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                  <div style={taxSection}>
                    {getTotal(
                      subTotal,
                      invoice.discount,
                      invoice.cgst,
                      invoice.sgst,
                      invoice.taxableSubtotal,
                    )}
                    {currencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>Total :</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewInvoice
