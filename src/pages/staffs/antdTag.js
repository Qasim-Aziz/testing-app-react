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
    const { tags } = this.state
    const { changeTagsHandler } = this.props
    const Tags = tags.filter(tag => tag !== removedTag)
    // console.log(Tags)
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

    console.log(tags, inputValue, ' handle INputinput 1 ')

    if (inputValue) {
      if (tags.length > 0 && tagArray?.length > 0 && tags?.indexOf(inputValue) === -1) {
        tags = [...tagArray, inputValue]
      } else if (tags.length === 0 && tagArray?.length > 0) {
        tags = [...tagArray, inputValue]
      } else if (tags.length === 0) {
        tags = [inputValue]
      }
    }

    console.log(tags, inputValue, ' handle INputinput 2')

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
    console.log('handleEdit Input')
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
    console.log(this.props.defaultVal, tags, 'props')
    console.log(this.state)
    return (
      <>
        {tagArray?.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                className="tag-input"
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
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </>
    )
  }
}

export default EditableTagGroup
