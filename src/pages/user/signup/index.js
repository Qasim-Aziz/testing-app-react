import React from 'react'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'
import RegisterForm from './RegisterForm'

class Register extends React.Component {
  render() {
    return (
      <>
        <div>
          <Helmet title="Login" />
          <div className={styles.block}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase" align="center">
                      <strong>SIGN UP</strong>
                    </h4>
                    <br />
                    <RegisterForm />

                    {/* <footer className={styles.footer}>
                      <ul className={styles.footerNav}>
                        <li>
                          <a href="javascript: void(0);">Terms of Use</a>
                        </li>
                        <li>
                          <a href="javascript: void(0);">Compliance</a>
                        </li>
                        <li>
                          <a href="javascript: void(0);">Confidential Information</a>
                        </li>
                        <li>
                          <a href="javascript: void(0);">Support</a>
                        </li>
                        <li>
                          <a href="javascript: void(0);">Contacts</a>
                        </li>
                      </ul>
                    </footer> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Register
