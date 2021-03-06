
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes }from '@fortawesome/free-solid-svg-icons'

const FileSearch = ({title, onFileSearch}) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  let node = useRef(null)

  const closeSearch = ()  => {
    // e.preventDefault()
    setInputActive(false)
    setValue('')
    onFileSearch('')
  }

  useEffect(() => {
    if(inputActive) {
      if(enterPressed) onFileSearch(value)
      if(escPressed) closeSearch()
    }
    // const handleInputEvent = (event) => {
    //   const { keyCode } = event;
    //   if(inputActive) {
    //     if(keyCode === 13 && value) {
    //       onFileSearch(value)
    //       closeSearch(event)
    //     } else if(keyCode === 27) {
    //       closeSearch(event)
    //     }
    //   }
    // }

    // document.addEventListener('keyup', handleInputEvent)
    // return () => document.removeEventListener('keyup', handleInputEvent)
  })

  useEffect(() => {
    if(inputActive) {
      node.current.focus()
      // node.current.addEventListener('blur', closeSearch)
      // return () => node.current && node.current.removeEventListener('blur', closeSearch)
    }
  }, [inputActive])

  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0 no-border-radius">
      {!inputActive && 
        <>
          <span>{title}</span>
          <button type="button" className="icon-button"
            onClick={() => setInputActive(true)}>
              <FontAwesomeIcon icon={faSearch} title="Search" size="lg"></FontAwesomeIcon>
          </button>
        </>
      }
      {inputActive &&
        <>
          <input type="text" className="form-control" value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={node}
            size="small"/>
          <button type="button" className="icon-button"
            onClick={closeSearch}>
              <FontAwesomeIcon icon={faTimes} title="Close" size="lg"></FontAwesomeIcon>
          </button>
        </>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title : PropTypes.string,
  onFileSearch : PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title : '我的云文档'
}

export default FileSearch