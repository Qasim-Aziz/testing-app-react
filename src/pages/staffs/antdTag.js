/* eslint-disable react/destructuring-assignment */
/* eslint-disable */
import React from 'react'
import { Tag, Input, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tags: new Array(),
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    }
  }

  handleClose = removedTag => {
    const { changeTagsHandler, tagArray } = this.props
    const Tags = tagArray?.filter(tag => tag !== removedTag)
    this.setState({ tags: Tags })
    changeTagsHandler(Tags)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { changeTagsHandler, tagArray } = this.props
    const { inputValue } = this.state
    let tags = this.state.tags ? this.state.tags : []

    if (inputValue) {
      if (tags.length > 0 && tagArray?.length > 0 && tags?.indexOf(inputValue) === -1) {
        tags = [...tagArray, inputValue]
      } else if (tags.length === 0 && tagArray?.length > 0) {
        tags = [...tagArray, inputValue]
      } else if (tags.length === 0) {
        tags = [inputValue]
      }
    } else {
      tags = tagArray
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    })
    changeTagsHandler(tags)
  }

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value })
  }

  handleEditInputConfirm = () => {
    const { changeTagsHandler, tagArray } = this.props
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tagArray]
      newTags[editInputIndex] = editInputValue
      changeTagsHandler(newTags)
      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      }
    })
  }

  saveInputRef = input => {
    this.input = input
  }

  saveEditInputRef = input => {
    this.editInput = input
  }

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state
    const { tagArray } = this.props
    return (
      <>
        <div
          style={{
            display: 'flex',
            minHeight: 35,
            flexWrap: 'wrap',
            alignContent: 'center',
            margin: '2px 0 0',
          }}
        >
          {tagArray?.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={this.saveEditInputRef}
                  key={tag}
                  className="tag-input"
                  style={{ margin: 'auto 2px', minWidth: 100, maxWidth: 160 }}
                  value={editInputValue}
                  onChange={this.handleEditInputChange}
                  onBlur={this.handleEditInputConfirm}
                  onPressEnter={this.handleEditInputConfirm}
                />
              )
            }

            const isLongTag = tag.length > 20
            const { closeable } = this.props
            const tagElem = (
              <Tag
                className="edit-tag"
                key={tag}
                style={{ margin: '2px' }}
                closable={closeable}
                onClose={() => this.handleClose(tag)}
              >
                <span
                  onClick={e => {
                    if (index !== 0) {
                      this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                        this.editInput.focus()
                      })
                      e.preventDefault()
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            )
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            )
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              className="tag-input"
              value={inputValue}
              style={{ margin: 'auto 2px', minWidth: 100, maxWidth: 160 }}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className="site-tag-plus" style={{ margin: '2px' }} onClick={this.showInput}>
              <PlusOutlined />
            </Tag>
          )}
        </div>
      </>
    )
  }
}

export default EditableTagGroup
