const router = require('express').Router();

router.all('/', (req, res) => {
  res.status(404).send({ message: 'Такого ресурса не сушествует' });
});

module.exports = router;
