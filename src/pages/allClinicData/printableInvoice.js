/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, Image, PDFViewer } from '@react-pdf/renderer'
import { ToWords } from 'to-words'
import moment from 'moment'
import logo from '../../images/WhatsApp Image 2020-04-23 at 10.00.40 (1).jpeg'

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
  width: '50%',
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
  width: '40%',
  maxWidth: '50%',
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

function getTotal(subTotal, discount = 0, cgst = 0, sgst = 0, taxableSubtotal = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(cgst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(taxableSubtotal || 0),
  ).toFixed(2)
}

function PrintableInvoice() {
  const invoice = JSON.parse(localStorage.getItem('currentInvoice'))
  const [subTotal, setSubtotal] = useState(0)
  const currentCurrency = invoice.clinic.currency ? invoice.clinic.currency.symbol : '$'
  const currentCurrencyName = invoice.clinic.currency ? invoice.clinic.currency.currency : 'USD'

  useEffect(() => {
    let tempSubTotal = 0
    invoice.invoiceFee.edges.map(item => {
      const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(3)
      tempSubTotal = (Number(tempSubTotal) + Number(tempTotal)).toFixed(3)
    })
    setSubtotal(tempSubTotal)
  }, [])

  const toWords = new ToWords({
    localeCode: currentCurrencyName === 'INR' ? 'en-IN' : 'en-US',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  })

  const total = getTotal(
    subTotal,
    invoice.discount,
    invoice.cgst,
    invoice.sgst,
    invoice.taxableSubtotal,
  )

  return (
    <PDFViewer style={{ width: '100%', height: '1000px' }}>
      <Document>
        <Page
          size="A4"
          style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 10,
          }}
          wrap={false}
          scale={5}
        >
          <View style={{ width: '100%', height: '100%', margin: 'auto' }}>
            <View style={sectionMain}>
              <View style={{ ...section, height: '120px' }}>
                <Image src={logo} style={{ width: '30%', alignSelf: 'center' }} />
                <View
                  style={{
                    textAlign: 'center',
                    width: '250px',
                    alignSelf: 'center',
                    fontWeight: '600',
                    marginLeft: '20px',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    SM Learning Skills Academy for Special Needs Pvt. Ltd.
                  </Text>
                  <Text
                    style={{
                      // marginBottom: '8px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    Gurugram, Haryana 122002 India
                  </Text>
                  <Text
                    style={{
                      // marginBottom: '8px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    GSTIN 06AAXCS2626LIZQ
                  </Text>
                </View>
                <View
                  style={{
                    textAlign: 'center',
                    width: '200px',
                    alignSelf: 'center',
                  }}
                >
                  <Text>{invoice.invoiceNo}</Text>
                </View>
              </View>
              <View style={{ ...section, height: '120px', padding: '0' }}>
                <View style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> #INV</Text>
                    <Text style={dateSection}> : {invoice.invoiceNo}</Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Issue Date</Text>
                    <Text style={dateSection}> : {invoice.issueDate}</Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Due Date</Text>
                    <Text style={dateSection}> : {invoice.dueDate}</Text>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Place of supply</Text>
                    <Text style={dateSection}> : {invoice.address}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderBottom: '1px solid black',
                  height: '75px',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#fafafa',
                }}
              >
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text
                    style={{
                      ...general,
                      alignSelf: 'flex-start',
                      width: '100px',
                      fontWeight: '600',
                    }}
                  >
                    Bill To
                  </Text>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                    : {invoice.clinic.schoolName}, {invoice.address}
                  </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text
                    style={{
                      ...general,
                      alignSelf: 'flex-start',
                      width: '100px',
                      fontWeight: '600',
                    }}
                  >
                    Email
                  </Text>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                    : {invoice.email}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderBottom: '1px solid black',
                  height: '65px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    ...general,
                    alignSelf: 'flex-start',
                    width: '100px',
                    fontWeight: '600',
                  }}
                >
                  Subject
                </Text>
                <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                  : Cogniable Service Invoice for{' '}
                  {
                    monthNames[
                      moment(invoice.issueDate)
                        .subtract(1, 'M')
                        .format('MM') - 1
                    ]
                  }{' '}
                  {new Date(invoice.issueDate).getFullYear()}
                </Text>
              </View>
              <View style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
                <Text
                  style={{
                    ...qtyCol,
                    width: '30px',
                    alignSelf: 'flex-start',
                    borderLeft: 'none',
                    fontWeight: '600',
                  }}
                >
                  #
                </Text>
                <Text style={{ ...serviceCol, fontWeight: '600' }}>Service</Text>
                <View style={{ ...qtyCol, fontWeight: '600' }}>
                  <Text style={rightText}>Quantity</Text>
                </View>
                <View style={{ ...qtyCol, fontWeight: '600' }}>
                  <Text style={rightText}>Rate</Text>
                </View>
                <View style={{ ...qtyCol, fontWeight: '600', width: '24%' }}>
                  <Text style={rightText}>Amount</Text>
                </View>
              </View>
              {invoice.invoiceFee.edges.map((item, index) => {
                const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(2)
                return (
                  <View key={item.node.schoolServices.name} style={rowStyle}>
                    <View
                      style={{
                        ...qtyCol,
                        width: '30px',
                        borderLeft: 'none',
                      }}
                    >
                      <Text style={{ margin: 'auto' }}>{index + 1}. </Text>
                    </View>
                    <Text style={serviceCol}>{item.node.schoolServices.name}</Text>
                    <View style={qtyCol}>
                      <Text style={rightText}>{item.node.quantity}</Text>
                    </View>
                    <View style={qtyCol}>
                      <Text style={rightText}>
                        {currentCurrency} {item.node.rate}
                      </Text>
                    </View>
                    <View style={{ ...qtyCol, width: '24%' }}>
                      <Text style={rightText}>
                        {currentCurrency} {tempTotal}
                      </Text>
                    </View>
                  </View>
                )
              })}
              <View
                style={{
                  ...rowStyle,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  backgroundColor: '#fafafa',
                }}
              >
                <Text style={{ ...general }}>Subtotal :</Text>
                <View style={{ ...qtyCol, width: '18.8%', borderLeft: 'none' }}>
                  <Text style={rightText}>
                    {currentCurrency} {subTotal}
                  </Text>
                </View>
              </View>
              <View style={{ ...section, padding: '0', height: '180px', borderBottom: 'none' }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                    {toWords.convert(total)}
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    borderLeft: '1px solid black',
                  }}
                >
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        {currentCurrency} -
                        {Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}
                      </Text>
                    </View>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        Discount ({invoice.discount || 0}%) :
                      </Text>
                    </View>
                  </View>
                  <View style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        {currentCurrency}{' '}
                        {Number((subTotal / 100) * parseFloat(invoice.cgst || 0)).toFixed(2)}
                      </Text>
                    </View>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        CGST ({invoice.cgst || 0}%) :
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        {currentCurrency}{' '}
                        {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}
                      </Text>
                    </View>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        SGST ({invoice.sgst || 0}%) :
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        {currentCurrency}{' '}
                        {Number(
                          (subTotal / 100) * parseFloat(invoice.taxableSubtotal || 0),
                        ).toFixed(2)}
                      </Text>
                    </View>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        Taxes ({invoice.taxableSubtotal || 0}%) :
                      </Text>
                    </View>
                  </View>
                  <View style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>
                        {currentCurrency} {total}
                      </Text>
                    </View>
                    <View style={taxSection}>
                      <Text style={{ ...rightText, fontWeight: '600' }}>Total :</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PrintableInvoice
