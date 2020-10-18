const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null || undefined) {
        return res.status(404).send({ message: 'Карточки не существует' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (likes === null || undefined) {
        return res.status(404).send({ message: 'Карточки не существует' });
      }
      return res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (likes === null || undefined) {
        return res.status(404).send({ message: 'Карточки не существует' });
      }
      return res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
