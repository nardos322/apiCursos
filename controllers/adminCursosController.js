import { cursoDe, idIsRepeat, searchForName } from '../functions/functions.js';
import { getAllCursos } from '../database/database.js';
import { createRequire } from 'module';
import { writeFile, writeFileSync } from 'fs';
import { pool } from '../database/database.js';
const require = createRequire(import.meta.url);
const infoCurso = require('../database/cursos.json');




export const adminCursosController = {

  getListDisiplinas: async (req, res) => {
    // let matematicas = await pool.query('SELECT * FROM matematicas');
    // let programacion = await pool.query('SELECT * FROM programacion');
    // let allCursos = {matematicas: matematicas[0], programacion: programacion[0]}
    // return res.json(allCursos);
    let allCursos = await pool.query(`SELECT *  FROM matematicas
      UNION SELECT * FROM programacion`)
      return res.json(allCursos[0])

    // let tables = await pool.query('SHOW TABLES')
    // return res.json(tables[0].length)

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

    let result = allCursos[disiplina].filter(curso => curso.id == id)

    if (result.length > 0){
      return res.json(result[0]);
    }else{
      return res.status(404).send(`no se encontraron cursos en ${disiplina} con el id: ${id}`)
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

      return res.json(results.sort((a, b) => a.vistas - b.vistas));
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
        allCursos = await getAllCursos()
        return res.json(allCursos[disiplina]);
      
      } else {
        return res.status(404).send('el curso que sea agregar no coincide con la disiplina o tiene un id repetido');
      }
    }

  },
  putUpdateCurso: (req, res) => {
    const cursoActualizado = req.body;
    const disiplina = req.params.disiplina;
    const id = req.params.id;
    let indice;


    if (!infoCurso.hasOwnProperty(disiplina)) {
      return res.status(404).send('la disiplina no existe en el servidor');
    } else if (infoCurso.hasOwnProperty(disiplina)) {
      indice = infoCurso[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
      infoCurso[disiplina][indice] = cursoActualizado;
      writeFile('./database/cursos.json', JSON.stringify(infoCurso), err => {
        if (err) throw err;

        return res.json(infoCurso);
      });
    } else {
      return res.status(404).send('el curso que desea editar no esta en nuestra base de datos')
    };
  },
  patchCurso: (req, res) => {
    const infoActualizada = req.body;
    const disiplina = req.params.disiplina
    const id = req.params.id;
    let indice;

    if (!infoCurso.hasOwnProperty(disiplina)) {
      return res.status(404).send('la disiplina no existe en el servidor');
    } else if (infoCurso.hasOwnProperty(disiplina)) {
      indice = infoCurso[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
      const cursoAModificar = infoCurso.programacion[indice];
      Object.assign(cursoAModificar, infoActualizada);
      writeFile('./database/cursos.json', JSON.stringify(infoCurso), err => {
        if (err) throw err;

        return res.json(infoCurso);
      });
    } else {
      return res.status(404).send('el curso que desea editar no esta en nuestra base de datos');
    };
  },

  deleteCurso: (req, res) => {
    const id = req.params.id;
    const disiplina = req.params.disiplina;
    const indice = infoCurso[disiplina].findIndex(curso => curso.id == id);

    if (indice >= 0) {
      infoCurso[disiplina].splice(indice, 1);
      writeFile('./database/cursos.json', JSON.stringify(infoCurso), err => {
        if (err) throw err;

        return res.json(infoCurso);
      });
    } else {
      return res.status(404).send(`no se han encontrado cursos de ${disiplina} con el id: ${id}`)
    };


  },

  search: (req, res) => {
    const nameSearch = req.query.name;

    if (searchForName(infoCurso, nameSearch).length > 0) {

      return res.json(searchForName(infoCurso, nameSearch))
    } else {
      return res.status(404).send('no se encontraron cursos con ese nombre');
    }
  }
}

