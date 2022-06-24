import { BASE_URL } from '../constants/constants';

class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  get _headers() {
    return {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem("jwt")}`,
    }
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`)
    }
  }

  getProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  editProfile({name, about}) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({name, about}),
    }).then((res) => this._checkResponse(res));
  }

  editAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(avatar),
    }).then((res) => this._checkResponse(res));
  }

  addCard({name, link}) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({name, link}),
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }
}


export const api = new Api({
  baseUrl: BASE_URL,
});
