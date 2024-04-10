var express = require('express');
var router = express.Router();
var AdminService = require('../service/admin_service');
var Task = require('../models/task');
var _ = require('underscore');

const adminService = new AdminService();

router.get('/', async function (req, res, next) {
  const results = await adminService.getAllTasks();
  // const tasks = _.groupBy(results, (task) => {
  //   return task.caseno;
  // });
  res.send(results);
});

router.post('/', (req, res, next) => {
  res.send("Done");
})

router.post('/addcase', async (req, res) => {
  const result = await adminService.addTask(req.body);

  if(result) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
});

router.post('/updatecase', async (req, res) => {
  const result = await adminService.updateTask(req.body);

  if(result) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
});

router.post('/deletecase', async (req,res) => {
  const result = await adminService.deleteTask(req.body.caseno);
  if(result) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
})

module.exports = router;
