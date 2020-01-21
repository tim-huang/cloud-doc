
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes }from '@fortawesome/free-solid-svg-icons'
import { faMarkdown }from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../hooks/useKeyPress'

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ value, setValue ] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  
  const closeEdit = (editItem) => {
    // e.preventDefault()
    setEditStatus(false)
    setValue('')
    onFileDelete(editItem.id)
  }

  const node = useRef(null)

  useEffect(() => {
    editStatus !== false && node.current.focus()
  }, [editStatus])

  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if(newFile) {
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])

  useEffect(() => {
    if (editStatus !== false) {
      const editItem = files.find(f => f.id === editStatus)
      if (enterPressed && value) {
        onSaveEdit(editItem.id, value)
        setEditStatus(false)
      } else if(escPressed) {
        closeEdit(editItem)
      }
      // const handleInputEvent = (event) => {
      //   const { keyCode } = event;
      //   if(keyCode === 13 && value) {
      //     const editItem = files.find(f => f.id === editStatus)
      //     onSaveEdit(editItem.id, value)
      //     closeEdit(event)
      //   } else if(keyCode === 27) {
      //     closeEdit(event)
      //   }
      // }

      // node.current.addEventListener('keyup', handleInputEvent)
      // return () => node.current && node.current.removeEventListener('keyup', handleInputEvent)
    }
  })

  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(  file => 
          <li key={file.id}
            className="list-group-item bg-light row d-flex align-items-center mx-0"
          >
            { (file.id !== editStatus && !file.isNew) &&
              <>
                <span className="col-2"><FontAwesomeIcon icon={faMarkdown} size="lg"></FontAwesomeIcon></span>
                <span className="col-6 c-link" onClick={() => onFileClick(file.id)}>{file.title}</span>
                <button type="button" className="icon-button col-2"
                  onClick={() => {setEditStatus(file.id); setValue(file.title)}}>
                  <FontAwesomeIcon icon={faEdit} title="Edit" size="lg"></FontAwesomeIcon>
                </button>
                <button type="button" className="icon-button col-2"
                  onClick={() => {onFileDelete(file.id)}}>
                  <FontAwesomeIcon icon={faTrash} title="Delete" size="lg"></FontAwesomeIcon>
                </button>
              </>
            }
            { (file.id === editStatus || file.isNew) &&
              <>
                <input type="text" className="form-control col-10" value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="请输入文件名称"
                  ref={node}/>
                <button type="button" className="icon-button col-2"
                  onClick={() => closeEdit(file)}>
                    <FontAwesomeIcon icon={faTimes} title="Close" size="lg"></FontAwesomeIcon>
                </button>
              </>
            }
          </li>
        )
      }
    </ul>
  )
}

FileList.propTypes = {
  files : PropTypes.array,
  onFileClick : PropTypes.func,
  onFileDelete : PropTypes.func,
  onSaveEdit : PropTypes.func
}

export default FileList