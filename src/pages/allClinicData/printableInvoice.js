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
import { useQuery } from 'react-apollo'
import moment from 'moment'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { GET_PAYMENT_DETAILS } from './query'
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
  const currentCurrencyName = invoice.clinic.currency ? invoice.clinic.currency.currency : 'USD'
  const { data, loading, error } = useQuery(GET_PAYMENT_DETAILS)

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
  if (loading) {
    return <LoadingComponent />
  }
  console.log(data)
  console.log(invoice, 'invoice ')

  const {
    institutionName,
    streetAddress,
    city,
    state,
    country,
    pincode,
    accountHolderName,
    ifscCode,
    gpay,
    paytm,
    upi,
    bankName,
    gstin,
    accountNo,
  } = data.recievingPaymentDetails

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
                      marginBottom: '4px',
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    {institutionName}
                  </Text>
                  <Text
                    style={{
                      marginBottom: '4px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    {streetAddress} {city}, {state} {country?.name}, {pincode}
                  </Text>
                  <Text
                    style={{
                      marginBottom: '4px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    GSTIN {gstin}
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
                    <Text style={{ ...dateSection, width: '60%' }}> : {invoice.invoiceNo}</Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Issue Date</Text>
                    <Text style={{ ...dateSection, width: '60%' }}> : {invoice.issueDate}</Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Due Date</Text>
                    <Text style={{ ...dateSection, width: '60%' }}> : {invoice.dueDate}</Text>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Place of supply</Text>
                    <Text style={{ ...dateSection, width: '60%' }}> : {invoice.address}</Text>
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
                  <Text style={rightText}>Rate ({currentCurrencyName})</Text>
                </View>
                <View style={{ ...qtyCol, fontWeight: '600', width: '24%' }}>
                  <Text style={rightText}>Amount ({currentCurrencyName})</Text>
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
                      <Text style={rightText}>{item.node.rate}</Text>
                    </View>
                    <View style={{ ...qtyCol, width: '24%' }}>
                      <Text style={rightText}>{tempTotal}</Text>
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
                    {subTotal} {currentCurrencyName}
                  </Text>
                </View>
              </View>
              <View style={{ ...section, padding: '0', height: '220px', borderBottom: 'none' }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                    {toWords.convert(total)}
                  </Text>
                  <View
                    style={{
                      ...general,
                      display: 'flex',
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>Razor Pay: </Text>
                    <Text style={{ color: 'blue' }}>{invoice.paymentLink}</Text>
                  </View>

                  <View
                    style={{
                      ...general,
                      paddingBottom: '2px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>Bank A/C No: </Text>
                    <Text>{accountNo}</Text>
                  </View>
                  <View
                    style={{
                      ...general,
                      padding: '2px 8px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>IFSC Code: </Text>
                    <Text>{ifscCode}</Text>
                  </View>
                  <View
                    style={{
                      ...general,
                      display: 'flex',
                      padding: '2px 8px',
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>Branch: </Text>
                    <Text>{bankName}</Text>
                  </View>
                  <View
                    style={{
                      ...general,
                      display: 'flex',
                      padding: '2px 8px',
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold' }}>A/C Holder Name: </Text>
                    <Text>{accountHolderName}</Text>
                  </View>
                  {upi ? (
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        padding: '6px 8px 2px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>UPI: </Text>
                      <Text>{upi}</Text>
                    </View>
                  ) : null}
                  {gpay ? (
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        padding: '2px 8px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Google Pay: </Text>
                      <Text>{gpay}</Text>
                    </View>
                  ) : null}
                  {paytm ? (
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        padding: '2px 8px 6px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Paytm: </Text>
                      <Text>{paytm}</Text>
                    </View>
                  ) : null}
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
                        {Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}{' '}
                        {currentCurrencyName}
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
                        {Number((subTotal / 100) * parseFloat(invoice.cgst || 0)).toFixed(2)}{' '}
                        {currentCurrencyName}
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
                        {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}{' '}
                        {currentCurrencyName}
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
                        {Number(
                          (subTotal / 100) * parseFloat(invoice.taxableSubtotal || 0),
                        ).toFixed(2)}{' '}
                        {currentCurrencyName}
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
                        {total} {currentCurrencyName}
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
