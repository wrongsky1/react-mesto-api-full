const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => {
    res.send((cards));
  })
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send((card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации. Некорректные данные.');
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточки не существует'))

    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }

      card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })

    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточки не существует'))
    .then((data) => {
      res.send((data));
    })
    .catch(next);
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Карточки не существует'))
    .then((data) => {
      res.send((data));
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
