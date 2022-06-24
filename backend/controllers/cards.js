const Card = require('../models/card');
const {
  BadRequest, NotFound, Forbidden,
} = require('../errors');
const { prepareValidationMessage } = require('../utils');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(prepareValidationMessage(err)));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена.');
      } if (!card.owner.equals(req.user._id)) {
        throw new Forbidden('Запрещено удалять чужую карточку');
      }
      return card.remove()
        .then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный формат id'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный формат id'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный формат id'));
      }
      return next(err);
    });
};
