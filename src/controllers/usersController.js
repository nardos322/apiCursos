import { pool } from '../database/database.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const getUrl = (req) => req.protocol + "://" + req.get("host") + req.originalUrl;


export const usersController = {
    singUp: async (req, res) => {
        
        let errors = validationResult(req);
        let user = req.body;
       
        if(!errors.isEmpty()){
            return res.status(404).json({
                meta: {
                    endPoint: getUrl(req),
                    total: errors.errors.length,
                },
                errors: errors.mapped(),
            
            });
        }
        
        await pool.query(`INSERT INTO users VALUES (
            default, 
        '${user.name}', 
            '${user.lastname}',
            '${bcrypt.hashSync(user.password, 10)}',
            '${user.email}',
            default)`);
        let userRegister = await pool.query(`SELECT * FROM users WHERE email = '${user.email}'`)    
        userRegister = userRegister[0][0];
        const token = jwt.sign({id: userRegister.id, rol: userRegister.rol_id}, process.env.SECRET_KEY)    
        
        res.header('auth-token', token).status(201).json({
            meta:{
                message: 'usuario creado',
            },
            user: userRegister,
        })
    },

    singIn: async (req, res) => {
        let user = await pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);
        
        
       
       
        if(user[0].length == 0) return res.status(400).json({
            message: 'email o contraseña incorrectos'
        });
        user = user[0][0];
        let checkPassword = bcrypt.compareSync(req.body.password, user.password);
        if(!checkPassword) return res.status(400).json({
            message: 'email o contraseña invalidos'
        });
        
     
        const token = jwt.sign({id: user.id, rol: user.rol_id}, process.env.SECRET_KEY, {
            expiresIn: 60*60,
        });
        
        return res.header('auth-token', token).json({
            meta: {
                message: 'usuario valido',
            },
            user: user,
            
        })


     
    
    },

    profile: async (req, res) => {
        const user = await pool.query(`SELECT id, name, lastname, email, rol_id from users WHERE id = ${req.userId}`);
        
        if(user[0].length == 0) return res.status(404).json({
            message: 'no user found',
        })
        return res.json({
            user: user[0][0],

        })
    }
   
}
