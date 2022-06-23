import React, {useContext} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const {_id: currentUserId} = useContext(CurrentUserContext);
  const isOwn = (card.owner._id === currentUserId || card.owner === currentUserId);
  const cardDeleteButtonClassName = (
    `button element__delete-btn ${isOwn ? 'element__delete-btn_visible' : 'element__delete-btn_hidden'}`
  );

  const isLiked = card.likes.some(like => like === currentUserId);
  const cardLikeButtonClassName = `button element__like-btn ${isLiked ? 'element__like-btn_active' : ''}`;

  const handleClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    onCardLike(card);
  }

  const handleDeleteClick = () => {
    onCardDelete(card)
  }

  return (
    <li className="element">
      <div className="element__image-container">
        <img className="element__image"
             alt={card.name}
             src={card.link}
             onClick={handleClick}
        />
        <button
          className={cardDeleteButtonClassName}
          onClick={handleDeleteClick}
          name="delete"
          type="button"
          aria-label="Удалить"
        />
      </div>
      <div className="element__description">
        <h2 className="element__name">{card.name}</h2>
        <div className="element__like">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            aria-label="Нравится"
            name="like"
            type="button"
          />
          <span className="element__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>)
}

export default Card
