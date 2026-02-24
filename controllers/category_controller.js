const Category = require('../models/category');
const Joi = require('joi');
const response = require('../utils/response');

const schema = Joi.object({
  nama: Joi.string().min(3).required()
});

exports.getAll = async (req,res)=>{
  const data = await Category.getAll();
  response.success(res, data.rows);
};

exports.getById = async (req,res)=>{
  const data = await Category.getById(req.params.id);
  response.success(res, data.rows[0]);
};

exports.create = async (req,res)=>{
  const { error } = schema.validate(req.body);
  if(error) return res.status(400).json({message:error.message});

  const data = await Category.create(req.body.nama);
  response.success(res, data.rows[0], "Category berhasil dibuat");
};

exports.update = async (req,res)=>{
  const { error } = schema.validate(req.body);
  if(error) return res.status(400).json({message:error.message});

  const data = await Category.update(req.params.id, req.body.nama);
  response.success(res, data.rows[0], "Category berhasil diupdate");
};

exports.remove = async (req,res)=>{
  await Category.remove(req.params.id);
  response.success(res, null, "Category berhasil dihapus");
};