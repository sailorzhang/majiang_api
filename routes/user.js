var express = require('express');
var router = express.Router();
var executeSQL = require('../service/db_helper');
var UserService = require('../service/user_service');
require('express-async-errors');

const userService = new UserService();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  res.send('hello!!!');
});

/* GET home page. */
router.post('/', function (req, res, next) {
  res.send({"name": "Sailor"})
});

router.get('/total', async (req, res, next) => {
  const total = await userService.getTotalAmountByUser();
  res.send(total);
});

router.get('/list',  async (req, res, next) => {
  const list = await userService.getCaseList();
  res.send(list);
});

router.get('/userlist', async (req, res) => {
  const list = await userService.getUserList();
  res.send(list);
});

router.get('/reports', async (req,res) => {
    const list = await userService.getReportData();
    const top_bottom = await userService.getTopBottom();
    res.send({'detail':list, ...top_bottom});
})

module.exports = router;
