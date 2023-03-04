import { check } from 'express-validator';
import { pool } from '../database/database.js';


export let validateRegister = [
    check('name')
        .notEmpty().withMessage('agregar nombre').bail()
        .isLength({ min: 2 }).withMessage('nombre demasiado corto'),
    check('lastname')
        .notEmpty().withMessage('agregar apellido').bail()
        .isLength({ min: 3 }).withMessage('apellido no valido'),
    check('password')
        .notEmpty().withMessage('ingresa una contraseña').bail()
        .isLength({ min: 6 }).withMessage('la contraseña debe tener minimo 6 caracteres'),
    check('email')
        .notEmpty().withMessage('agrega en un email').bail()
        .isEmail().withMessage('email formato no valido')
        .custom(async (email) => {
            
            let searchEmailDb = await pool.query(`SELECT email from users WHERE email = '${email}'`)
            
            let emailInDb = searchEmailDb[0];
            console.log(emailInDb.length)
            if (emailInDb.length > 0) {
                throw new Error ('email ya registrado');
                              
            }
        })
];