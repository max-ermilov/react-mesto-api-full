import React from "react";
import registrationSuccessIcon from "../images/auth-success.svg"
import registrationFailureIcon from "../images/auth-failure.svg"

export default function InfoTooltip({isOpen, onClose, isSignedUp}) {
  const registrationSuccessMessage = 'Вы успешно зарегистрировались!'
  const registrationFailureMessage = 'Что-то пошло не так! Попробуйте ещё раз.'

  return (
    <div className={`popup popup_type_info ${isOpen && "popup_opened"}`}
         onClick={onClose}
    >
      <div className="popup__container"
           onClick={e => {
             e.stopPropagation();
           }}
      >
        <img className="popup__info-icon"
             src={isSignedUp ? registrationSuccessIcon : registrationFailureIcon}
             alt={isSignedUp ? registrationSuccessMessage : registrationFailureMessage}
        />
        <h2 className="popup__title popup__title_type_info-tooltip">
          {isSignedUp ? registrationSuccessMessage : registrationFailureMessage}
        </h2>

        <button className="button popup__close-btn"
                type="button"
                name="close"
                onClick={onClose}
        />
      </div>
    </div>
  )
}
