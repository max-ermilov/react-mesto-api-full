import PopupWithForm from "./PopupWithForm";
import React, {useState, useEffect, useContext} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function EditProfilePopup({isOpen, onClose, onUpdateUser, isLoading}) {
  const currentUser = useContext(CurrentUserContext);
  const [formData, setFormData] = useState({name: currentUser.name, about: currentUser.about})

  useEffect(() => {
    setFormData({
      name: currentUser.name,
      about: currentUser.about
    })
  }, [currentUser, isOpen]);

  const handleInputChange = (e) => {
    setFormData( formData => ({...formData, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      name: formData.name,
      about: formData.about,
    })
  }

  return (
    <PopupWithForm name="edit-profile"
                   title="Редактировать профиль"
                   submitButtonText={isLoading ? 'Сохранение...' : 'Сохранить'}
                   isOpen={isOpen}
                   onClose={onClose}
                   onSubmit={handleSubmit}
    >
      <input type="text"
             className="popup__input popup__input_field_name"
             name="name"
             value={formData.name || ''}
             onChange={handleInputChange}
             id="name"
             placeholder="Имя"
             aria-label="Имя"
             minLength={2}
             maxLength={40}
             required
      />
      <span className="popup__input-error"
            id="name-error"
      />
      <input type="text"
             className="popup__input popup__input_field_job"
             name="about"
             value={formData.about || ''}
             onChange={handleInputChange}
             id="job"
             placeholder="Род занятий"
             aria-label="Род занятий"
             minLength={2}
             maxLength={200}
             required
      />
      <span className="popup__input-error"
            id="job-error"
      />
    </PopupWithForm>
  )
}
