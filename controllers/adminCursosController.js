import { cursoDe, idIsRepeat, searchForName } from '../functions/functions.js';
import { createRequire } from 'module';
import { writeFile, writeFileSync } from 'fs';
const require = createRequire(import.meta.url);
const infoCurso = require('../database/cursos.json');




export const adminCursosController = {

  getListDisiplinas: (req, res) => {
    let nameSearch = req.query.name
    return res.json(infoCurso);
  },
  getListDisiplinasCursos: (req, res) => {
    let disiplinaCursos = req.params.disiplinaCursos;

    if (infoCurso.hasOwnProperty(disiplinaCursos)) {
      return res.json(infoCurso[disiplinaCursos]);
    } else {
      return res.status(404).send('No se encontraron cursos para esa disiplina');
    }


  },

  getOneCurso: (req, res) => {
    let disiplina = req.params.disiplina;
    let id = req.params.id;

  
    if (!infoCurso.hasOwnProperty(disiplina)) {

      return res.send(`no se encontraron coincidencias para ${disiplina}`);
    };

    let result = infoCurso[disiplina].filter(curso => curso.id == id)

    if (result.length > 0){
      return res.json(result[0]);
    }else{
      return res.status(404).send(`no se encontraron cursos en ${disiplina} con el id: ${id}`)
    }


  },
  getListCurso: (req, res) => {
    let curso = req.params.curso;
    let disiplina = req.params.disiplina;
    let nivel = req.params.nivel;
    let results;


    if (!infoCurso.hasOwnProperty(disiplina)) {

      return res.send(`no se encontraron coincidencias para ${disiplina}`);
    };

    if (nivel) {
      results = infoCurso[disiplina].filter(nameCurso => {

        if (nameCurso.hasOwnProperty('lenguaje')) {
          return nameCurso.lenguaje == curso && nameCurso.nivel == nivel;
        } else if (nameCurso.hasOwnProperty('tema')) {
          return nameCurso.tema == curso && nameCurso.nivel == nivel;
        }

      });
    } else {
      results = infoCurso[disiplina].filter(nameCurso => {

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

  postAddCurso: (req, res) => {
    let disiplina = req.params.disiplina;
    let cursoNuevo = req.body;

    if (!infoCurso.hasOwnProperty(disiplina)) {

      return res.status(404).send('no se puede agregar cursos para esta disiplina');
    } else if (infoCurso.hasOwnProperty(disiplina)) {
      if (cursoDe(cursoNuevo).disiplina == 'matematicas' && disiplina == 'matematicas' && !idIsRepeat(infoCurso[disiplina], cursoNuevo.id)) {

        infoCurso.matematicas.push(cursoNuevo);

        writeFile('./database/cursos.json', JSON.stringify(infoCurso), err => {
          if (err) throw err;

          return res.json(infoCurso);
        });
      } else if (cursoDe(cursoNuevo).disiplina == 'programacion' && disiplina == 'programacion' && !idIsRepeat(infoCurso[disiplina], cursoNuevo.id)) {
        console.log(idIsRepeat(infoCurso[disiplina], cursoNuevo.id))
        infoCurso.programacion.push(cursoNuevo);

        writeFile('./database/cursos.json', JSON.stringify(infoCurso), err => {
          if (err) throw err;

          return res.json(infoCurso);
        });
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
      return res.status(404).send('no se encontraron cursos con ese nombre')
    }
  }
}

