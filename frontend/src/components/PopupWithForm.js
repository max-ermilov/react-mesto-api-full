import React from "react";

function PopupWithForm({children, isOpen, name, onClose, onSubmit, title, submitButtonText}) {

  return (
    <div className={`popup popup_type_${name} ${isOpen && "popup_opened"}`}
         onClick={onClose}
    >
      <div className="popup__container"
           onClick={e => {
             e.stopPropagation();
           }}
      >
        <h2 className="popup__title">{title}</h2>
        <form className="popup__form"
              onSubmit={onSubmit}
              name={name}
              id={name}
              noValidate>
          {children}
        </form>
        <button className="button popup__submit-btn popup__save-input-btn"
                type="submit"
                form={name}
                defaultValue="Cохранить"
                name="save"
        >{submitButtonText}
        </button>
        <button className="button popup__close-btn"
                type="button"
                name="close"
                onClick={onClose}
        />
      </div>
    </div>
  )
}

export default PopupWithForm
