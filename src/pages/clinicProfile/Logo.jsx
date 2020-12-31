import React, { useState } from 'react'
import {Upload, message, Button, Form} from 'antd'
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './clinicalProfile.module.scss'

const Logo = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(false)
  const [imageName, setImageName] = useState('')

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = info => {
    console.log('info==>', info.file.name)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl1 => {
        console.log('imageUrl1==>', imageUrl1)
        setImageUrl(imageUrl1)
        setLoading(false)
        setImageName(info.file.name)
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  const saveLogo = () => {
    console.log("saveLogo==>");
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageTitle}>
        <strong>Logo</strong>
      </div>

      <div>
        <div className={styles.logoWrapper}>
          <img src={imageUrl} alt="avatar" className={styles.logo} />
        </div>

        <div className="d-flex">
          <span className={styles.imageName}>{imageName}</span>
          <Upload
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <Button onChange={handleChange}>
              <UploadOutlined /> Click to Upload
            </Button>
          </Upload>
        </div>
        <Form.Item>
          <Button onClick={saveLogo} type="primary" htmlType="submit">
            Save Logo
          </Button>
        </Form.Item>
      </div>
    </div>
  )
}

export default Logo
