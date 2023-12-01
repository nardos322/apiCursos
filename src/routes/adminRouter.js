import express from 'express';
import { cursosController } from '../controllers/cursosController.js';
import { verifyTokekAdmin } from '../middlewares/verifyTokenAdmin.js';
const adminRouter = express.Router();




adminRouter.get('/', cursosController.getListDisiplinas);

adminRouter.get('/search', cursosController.search);

adminRouter.get('/:disiplina/id/:id', cursosController.getOneCurso);

adminRouter.get('/:disiplinaCursos', cursosController.getListDisiplinasCursos);

adminRouter.get('/:disiplina/:curso/:nivel?', cursosController.getListCurso);

adminRouter.post('/:disiplina', verifyTokekAdmin, cursosController.postAddCurso);

adminRouter.put('/:disiplina/id/:id', verifyTokekAdmin, cursosController.putUpdateCurso);

adminRouter.patch('/:disiplina/id/:id', verifyTokekAdmin, cursosController.patchUpdateCurso);

adminRouter.delete('/:disiplina/id/:id',verifyTokekAdmin, cursosController.deleteCurso);

export { adminRouter };