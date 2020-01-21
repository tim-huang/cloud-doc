import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomBtn = ({icon, text, onBtnClick, colorClass}) => {
    return (
        <button
            type="button"
            className={`btn btn-block no-border-radius ${colorClass}`}
            onClick={onBtnClick}
        >
            <FontAwesomeIcon size="lg" icon={icon} className="mr-2"></FontAwesomeIcon>
            {text}
        </button>
    )
}

BottomBtn.propTypes = {
    text : PropTypes.string,
    icon : PropTypes.object.isRequired,
    colorClass : PropTypes.string,
    onBtnClick : PropTypes.func,
}

export default BottomBtn
