import express from 'express';
import { adminCursosController } from '../controllers/adminCursosController.js';
const adminCursosRouter = express.Router();

adminCursosRouter.use(express.json());


adminCursosRouter.get('/', adminCursosController.getListDisiplinas);

adminCursosRouter.get('/search', adminCursosController.search);

adminCursosRouter.get('/:disiplina/id/:id', adminCursosController.getOneCurso);

adminCursosRouter.get('/:disiplinaCursos', adminCursosController.getListDisiplinasCursos);

adminCursosRouter.get('/:disiplina/:curso/:nivel?', adminCursosController.getListCurso);

adminCursosRouter.post('/:disiplina', adminCursosController.postAddCurso);

adminCursosRouter.put('/:disiplina/:id', adminCursosController.putUpdateCurso);

adminCursosRouter.delete('/:disiplina/:id', adminCursosController.deleteCurso);

export {adminCursosRouter};