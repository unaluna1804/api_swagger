const { body, validationResult } = require('express-validator');

exports.categoryValidation = [
  body('nama')
    .notEmpty()
    .withMessage('Nama wajib diisi'),

  (req,res,next)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array()
      });
    }

    next();
  }
];