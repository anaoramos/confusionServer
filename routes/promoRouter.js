
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();
const cors = require('./cors');

const authenticate = require('../authenticate');

promoRouter.route('/') //espec. o endpoint
// o app.all vai trabalhar no endpoint que especifiquei acima
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); }) //espec. o endpoint
.get(cors.cors, (req,res,next)=>{
   Promotions.find({})
   .then((promotions) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions); 
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
   Promotions.create(req.body)
   .then((promotion) => {
      console.log('Promotion Created', promotion);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
   }, (err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403; //403 means operation not supported
   res.end('PUT operation not supported on /Promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
   Promotions.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err));
});


promoRouter.route('/:promoId') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); }) //espec. o endpoint
.get(cors.cors, (req,res,next)=>{
   Promotions.findById(req.params.promoId)
   .then((promo) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo); 
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next)=>{
   res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
   Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
   }, {new: true })
   .then((promo) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req,res,next)=>{
   Promotions.findByIdAndRemove(req.params.promoId)
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err));
});


module.exports = promoRouter;

