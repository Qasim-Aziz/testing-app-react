import React from 'react'
import EmailNotification from './EmailNotification'
import ContactDetails from './ContactDetails'
import MasteryCriteria from './MasteryCriteria'
import Logo from './Logo'
import SupportTicket from './SupportTicket'
import InvoicingCurrency from './InvoicingCurrency'
import InvoiceInformation from './InvoiceInformation'

const MenuPages = ({ selectedTab }) => {
  const obj = {
    emailNotification: <EmailNotification />,
    supportTicket: <SupportTicket />,
    invoiceInformation: <InvoiceInformation />,
    contactDetails: <ContactDetails />,
    masteryCriteria: <MasteryCriteria />,
    logo: <Logo />,
    invoicingCurrency: <InvoicingCurrency />,
  }

  return obj[selectedTab]
}

export default MenuPages
