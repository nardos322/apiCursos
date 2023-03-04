import { Router } from "express";
import { usersController } from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validateRegister } from "../validations/registerValidator.js";


const usersRouter = Router();


usersRouter.post('/auth/singup', validateRegister, usersController.singUp);
usersRouter.post('/auth/singin', usersController.singIn);
usersRouter.get('/profile', verifyToken, usersController.profile )








export {usersRouter};