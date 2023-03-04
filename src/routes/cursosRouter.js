import express from 'express';
import { cursosController } from '../controllers/cursosController.js';
import { verifyTokekAdmin } from '../middlewares/verifyTokenAdmin.js';
const cursosRouter = express.Router();




cursosRouter.get('/', cursosController.getListDisiplinas);

cursosRouter.get('/search', cursosController.search);

cursosRouter.get('/:disiplina/id/:id', cursosController.getOneCurso);

cursosRouter.get('/:disiplinaCursos', cursosController.getListDisiplinasCursos);

cursosRouter.get('/:disiplina/:curso/:nivel?', cursosController.getListCurso);

cursosRouter.post('/:disiplina', verifyTokekAdmin, cursosController.postAddCurso);

cursosRouter.put('/:disiplina/:id', verifyTokekAdmin, cursosController.putUpdateCurso);

cursosRouter.patch('/:disiplina/:id', verifyTokekAdmin, cursosController.patchUpdateCurso);

cursosRouter.delete('/:disiplina/:id',verifyTokekAdmin, cursosController.deleteCurso);

export { cursosRouter };