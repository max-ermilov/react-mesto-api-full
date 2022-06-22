import React from "react";

function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_image ${card.name && "popup_opened"}`}
         onClick={onClose}
    >
      <figure className="popup__image-container"
              onClick={e => {
                e.stopPropagation();
              }}
      >
        <img className="popup__image"
             alt={card.name}
             src={card.link}
        />
        <figcaption><h2 className="popup__image-name">{card.name}</h2></figcaption>
        <button className="button popup__close-btn"
                type="button"
                name="close"
                onClick={onClose}
        />
      </figure>
    </div>
  )
}

export default ImagePopup
