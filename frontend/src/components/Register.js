import React, {useState} from "react";
import {Link} from "react-router-dom";

export default function Register({onRegister}) {
  const [formData, setFormData] = useState({password: '', email: ''});

  const handleInputChange = (e) => {
    setFormData(formData => ({...formData, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  }

  return (
    <div className="form-container">
      <div className="form">
        <h2 className="form__title">Регистрация</h2>
        <form
          className="form__form"
          onSubmit={handleSubmit}
        >
          <input type="email"
                 className="form__input"
                 name="email"
                 lang="en"
                 autoComplete="username"
                 value={formData.email || ''}
                 onChange={handleInputChange}
                 id="email"
                 placeholder="Email"
                 aria-label="Email"
                 minLength={5}
                 maxLength={320}
                 required
          />
          <span className="form__input-error"
                id="name-error"
          />
          <input type="password"
                 className="form__input"
                 name="password"
                 autoComplete="current-password"
                 value={formData.password || ''}
                 onChange={handleInputChange}
                 id="password"
                 placeholder="Пароль"
                 aria-label="Пароль"
                 minLength={8}
                 maxLength={32}
                 required
          />
          <span className="form__input-error"
                id="job-error"
          />
          <button className="button form__submit-btn"
                  type="submit"
                  defaultValue="Войти"
                  name="sign-in"
          >Зарегистрироваться
          </button>
        </form>
        <p className="form__note">
          Уже зарегистрированы?&#32; {/* "&#32;" adds breakable space between text and link*/}
          <Link className="button form__navigation-button" to="/sign-in">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
