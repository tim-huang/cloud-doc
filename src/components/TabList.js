import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ({files, activeId, unsavedIds, onClickTab, onCloseTab}) => {
    return (
        <ul className="nav nav-pills tablist-component">
            {
                files.map(file => {
                    const unsaved = unsavedIds && unsavedIds.includes(file.id)
                    const fClassName = classNames({
                        "nav-link" : true,
                        "active" : activeId === file.id,
                        'unsaved' : unsaved
                    })
                    return (

                        <li 
                            className="nav-item"
                            key={file.id}
                        >
                            <a
                                href="#"
                                className={fClassName}
                                onClick={(e) => {e.preventDefault(); onClickTab(file.id)}}
                            >
                                {file.title}
                                <span 
                                    className="ml-2 close-icon"
                                    onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}
                                >
                                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                                </span>
                                {
                                    unsaved &&
                                    <span className="rounded-circle unsaved-icon ml-2"></span>
                                }
                            </a>
                            
                        </li>
                    )
                })
            }
        </ul>
    )
}

TabList.propTypes = {
    files : PropTypes.array,
    activeId: PropTypes.string,
    unsavedIds : PropTypes.array,
    onClickTab : PropTypes.func,
    onCloseTab : PropTypes.func,
}

export default TabList
