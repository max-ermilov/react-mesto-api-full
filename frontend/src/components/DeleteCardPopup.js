import PopupWithForm from "./PopupWithForm";
import React from "react";

export default function DeleteCardPopup({card, isLoading, isOpen, onCardDelete, onClose}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCardDelete(card)
  }

  return (
  <PopupWithForm name="delete-confirm"
                 title="Вы уверены?"
                 submitButtonText={isLoading ? 'Удаление...' : 'Да'}
                 isOpen={isOpen}
                 onClose={onClose}
                 onSubmit={handleSubmit}
  />)
}
