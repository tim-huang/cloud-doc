
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes }from '@fortawesome/free-solid-svg-icons'
import { faMarkdown }from '@fortawesome/free-brands-svg-icons'

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ value, setValue ] = useState('')
  
  const closeEdit = (e) => {
    e.preventDefault()
    setEditStatus(false)
    setValue('')
  }

  const node = useRef(null)

  useEffect(() => {
    editStatus !== false && node.current.focus()
  }, [editStatus])

  useEffect(() => {
    if (editStatus !== false) {
      const handleInputEvent = (event) => {
        const { keyCode } = event;
        if(keyCode === 13 && value) {
          const editItem = files.find(f => f.id === editStatus)
          onSaveEdit(editItem.id, value)
          closeEdit(event)
        } else if(keyCode === 27) {
          closeEdit(event)
        }
      }

      node.current.addEventListener('keyup', handleInputEvent)
      return () => node.current && node.current.removeEventListener('keyup', handleInputEvent)
    }
  })

  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(  file => 
          <li key={file.id}
            className="list-group-item bg-light row d-flex align-items-center"
          >
            { (file.id !== editStatus) &&
              <>
                <span className="col-2"><FontAwesomeIcon icon={faMarkdown} size="lg"></FontAwesomeIcon></span>
                <span className="col-8 c-link" onClick={() => onFileClick(file.id)}>{file.title}</span>
                <button type="button" className="icon-button col-1"
                  onClick={() => {setEditStatus(file.id); setValue(file.title)}}>
                  <FontAwesomeIcon icon={faEdit} title="Edit" size="lg"></FontAwesomeIcon>
                </button>
                <button type="button" className="icon-button col-1"
                  onClick={() => {onFileDelete(file.id)}}>
                  <FontAwesomeIcon icon={faTrash} title="Delete" size="lg"></FontAwesomeIcon>
                </button>
              </>
            }
            { (file.id === editStatus) &&
              <>
                <input type="text" className="form-control col-10" value={value}
                  onChange={(e) => setValue(e.target.value)}
                  ref={node}/>
                <button type="button" className="icon-button col-2"
                  onClick={closeEdit}>
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