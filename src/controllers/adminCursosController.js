import { cursoDe, idIsRepeat, searchForName } from '../functions/functions.js';
import { getAllCursos } from '../database/database.js';
import { createRequire } from 'module';
import { pool } from '../database/database.js';
const require = createRequire(import.meta.url);



export const adminCursosController = {


  getListDisiplinas: async (req, res) => {
   
    let allCursos = await getAllCursos();
      return res.json(allCursos);

  },
  getListDisiplinasCursos: async (req, res) => {
    let disiplinaCursos = req.params.disiplinaCursos;
    let allCursos = await getAllCursos();

    if (allCursos.hasOwnProperty(disiplinaCursos)) {
      return res.json(allCursos[disiplinaCursos]);
    } else {
      return res.status(404).send('No se encontraron cursos para esa disiplina');
    }


  },

  getOneCurso: async (req, res) => {
    let disiplina = req.params.disiplina;
    let id = req.params.id;
    let allCursos = await getAllCursos();
  
    if (!allCursos.hasOwnProperty(disiplina)) {

      return res.send(`no se encontraron coincidencias para ${disiplina}`);
    };

    let result = allCursos[disiplina].filter(curso => curso.id == id);

    if (result.length > 0){
      return res.json(result[0]);
    }else{
      return res.status(404).send(`no se encontraron cursos en ${disiplina} con el id: ${id}`);
    }


  },
  getListCurso: async (req, res) => {
    let curso = req.params.curso;
    let disiplina = req.params.disiplina;
    let nivel = req.params.nivel;
    let allCursos = await getAllCursos();
    let results;


    if (!allCursos.hasOwnProperty(disiplina)) {

      return res.send(`no se encontraron coincidencias para ${disiplina}`);
    };

    if (nivel) {
      results = allCursos[disiplina].filter(nameCurso => {

        if (nameCurso.hasOwnProperty('lenguaje')) {
          return nameCurso.lenguaje == curso && nameCurso.nivel == nivel;
        } else if (nameCurso.hasOwnProperty('tema')) {
          return nameCurso.tema == curso && nameCurso.nivel == nivel;
        }

      });
    } else {
      results = allCursos[disiplina].filter(nameCurso => {

        if (nameCurso.hasOwnProperty('lenguaje')) {
          return nameCurso.lenguaje == curso;
        } else if (nameCurso.hasOwnProperty('tema')) {
          return nameCurso.tema == curso;
        }

      });
    }

    if (results.length == 0 && nivel) {
      return res.status(404).send(`No se encontraron cursos de ${curso} y "${nivel}"`);

    } else if (results.length == 0) {
      console.log('hola')
      return res.status(404).send(`en la disiplina ${disiplina} no se encontraron cursos de ${curso}`);

    };

    if (req.query.ordenar === 'vistas') {
      
      return res.json(results.sort((a, b) => b.vistas - a.vistas));
    }

    return res.json(results);
  },

  postAddCurso: async (req, res) => {
    let disiplina = req.params.disiplina;
    let cursoNuevo = req.body;
    let allCursos = await getAllCursos();

 

    if (!allCursos.hasOwnProperty(disiplina)) {

      return res.status(404).send('no se puede agregar cursos para esta disiplina');
    } else if (allCursos.hasOwnProperty(disiplina)) {
      if (cursoDe(cursoNuevo).disiplina == `${disiplina}` && !idIsRepeat(allCursos[disiplina], cursoNuevo.id)) {

        pool.query(`INSERT INTO ${disiplina} (titulo,${cursoDe(cursoNuevo).disiplina == 'matematicas'? 'tema': 'lenguaje'},vistas, nivel) VALUES 
        ('${req.body.titulo}', '${cursoDe(cursoNuevo).disiplina == 'matematicas'? req.body.tema: req.body.lenguaje}', '${req.body.vistas}', '${req.body.nivel}')`);
        allCursos = await getAllCursos();
        return res.json(allCursos[disiplina]);
      
      } else {
        return res.status(404).send('el curso que sea agregar no coincide con la disiplina o tiene un id repetido');
      }
    }

  },
  putUpdateCurso: async (req, res) => {
    const cursoActualizado = req.body;
    const disiplina = req.params.disiplina;
    const id = req.params.id;
    let allCursos = await getAllCursos();
    let indice;


    if (!allCursos.hasOwnProperty(disiplina)) {
      return res.status(404).send('la disiplina no existe en el servidor');
    } else if (allCursos.hasOwnProperty(disiplina)) {
      indice = allCursos[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
      if(cursoActualizado.hasOwnProperty('tema')){
        pool.query(`UPDATE ${disiplina} SET titulo= '${cursoActualizado.titulo}', tema= '${cursoActualizado.tema}', vistas= '${cursoActualizado.vistas}', nivel= '${cursoActualizado.nivel}' WHERE id = ${indice + 1}`);
        allCursos = await getAllCursos();
        return res.json(allCursos[disiplina]);
      }else if(cursoActualizado.hasOwnProperty('lenguaje')){
        pool.query(`UPDATE ${disiplina} SET titulo= '${cursoActualizado.titulo}', lenguaje= '${cursoActualizado.lenguaje}', vistas= '${cursoActualizado.vistas}', nivel= '${cursoActualizado.nivel}' WHERE id = ${indice + 1}`);
        allCursos = await getAllCursos();
        return res.json(allCursos[disiplina]);
      }
      

    } else {
      
      return res.status(404).send('el curso que desea editar no esta en nuestra base de datos');
    };
  },
  patchCurso: async (req, res) => {
    const infoActualizada = req.body;
    const disiplina = req.params.disiplina  
    const id = req.params.id;
    let allCursos = await getAllCursos();
    let indice;

    if (!allCursos.hasOwnProperty(disiplina)) {
      return res.status(404).send('la disiplina no existe en el servidor');
    } else if (allCursos.hasOwnProperty(disiplina)) {
      indice = allCursos[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
      const cursoAModificar = allCursos[disiplina][indice];
      
      Object.assign(cursoAModificar, infoActualizada);
      if(cursoAModificar.hasOwnProperty('tema')){
        pool.query(`UPDATE ${disiplina} SET id=${cursoAModificar.id}, titulo= '${cursoAModificar.titulo}', tema= '${cursoAModificar.tema}', vistas= '${cursoAModificar.vistas}', nivel= '${cursoAModificar.nivel}' WHERE id = ${id}`);
        allCursos = await getAllCursos();
        return res.json(allCursos[disiplina]);
      } else if(cursoAModificar.hasOwnProperty('lenguaje')) {
        pool.query(`UPDATE ${disiplina} SET id=${cursoAModificar.id}, titulo= '${cursoAModificar.titulo}', lenguaje= '${cursoAModificar.lenguaje}', vistas= '${cursoAModificar.vistas}', nivel= '${cursoAModificar.nivel}' WHERE id = ${id}`);
        allCursos = await getAllCursos();
        return res.json(allCursos[disiplina]);
      }
      
    } else {
      return res.status(404).send('el curso que desea editar no esta en nuestra base de datos');
    };
  },

  deleteCurso: async (req, res) => {
    const id = req.params.id;
    const disiplina = req.params.disiplina;
    let allCursos = await getAllCursos();
    const indice = allCursos[disiplina].findIndex(curso => curso.id == id);

    if (indice >= 0) {
      pool.query(`DELETE FROM ${disiplina} WHERE id = ${id}`);
      allCursos = await getAllCursos();
      return res.json(allCursos[disiplina]);
    } else {
      return res.status(404).send(`no se han encontrado cursos de ${disiplina} con el id: ${id}`)
    };


  },

  search: async (req, res) => {
    const nameSearch = req.query.name;
    
    let getCursos = await pool.query(`SELECT *  FROM matematicas
      UNION SELECT * FROM programacion`);
    let allCursos = getCursos[0];
     
    if (searchForName(allCursos, nameSearch).length > 0) {

      return res.json(searchForName(allCursos, nameSearch))
    } else {
      return res.status(404).send('no se encontraron cursos con ese nombre');
    }
  }
}

