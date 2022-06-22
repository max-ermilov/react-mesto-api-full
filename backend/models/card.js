const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '{PATH} - обязательное поле. '],
    minlength: [2, 'Минимальная длина свойства {PATH} должна быть 2. Передано {VALUE}. '],
    maxlength: [30, 'Максимальная длина свойства {PATH} должна быть 30. Передано {VALUE}. '],
  },
  link: {
    type: String,
    required: [true, '{PATH} - обязательное поле. '],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Недопустимый формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, '{PATH} - обязательное поле. '],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
