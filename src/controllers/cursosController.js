import { cursoDe, idIsRepeat, searchForName } from '../functions/functions.js';
import { getAllCursos, patchCurso, postCurso, putCurso } from '../database/database.js';
import { pool } from '../database/database.js';
const getUrl = (req) => req.protocol + "://" + req.get("host") + req.originalUrl;



export const cursosController = {


  getListDisiplinas: async (req, res) => {

    let allCursos = await getAllCursos();
    return res.json({
      meta: {
        endPoint: getUrl(req),
        total: allCursos.length,
      },
      data: allCursos,
    });

  },
  getListDisiplinasCursos: async (req, res) => {
    let disiplinaCursos = req.params.disiplinaCursos;
    let allCursos = await getAllCursos();

    if (allCursos.hasOwnProperty(disiplinaCursos)) {
      return res.json({
        meta: {
          endPoint: getUrl(req),
          total: allCursos[disiplinaCursos].length
        },
        data: allCursos[disiplinaCursos],
      });
    } else {
      return res.status(404).json({
        meta: {
          status: 404,
          message: 'Not found',
        }
      });
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

    if (result.length > 0) {
      return res.json({
        meta: {
          endPoint: getUrl(req),
          total: result[0].length,
        },
        data: result[0],
      });
    } else {
      return res.status(404).json({
        meta: {
          status: 404,
          message: `no se encontraron cursos en ${disiplina} con el id: ${id}`
        }
      });
    }


  },
  getListCurso: async (req, res) => {
    let curso = req.params.curso;
    let disiplina = req.params.disiplina;
    let nivel = req.params.nivel;
    let allCursos = await getAllCursos();
    let results;


    if (!allCursos.hasOwnProperty(disiplina)) {

      return res.status(404).json({
        meta: {
          status: 404,
          message: `no se encontraron coincidencias para ${disiplina}`,
        },
      });
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
      return res.status(404).json({
        meta: {
          status: 404,
          message: `No se encontraron cursos de ${curso} y "${nivel}"`,
        }
      });

    } else if (results.length == 0) {
      console.log('hola')
      return res.status(404).json({
        meta: {
          status: 404,
          message: `en la disiplina ${disiplina} no se encontraron cursos de ${curso}`,
        },
      });

    };

    if (req.query.ordenar === 'vistas') {

      return res.json({
        meta: {
          endPoint: getUrl(req),
          total: results.sort((a, b) => b.vistas - a.vistas).length
        },
        data: results.sort((a, b) => b.vistas - a.vistas)
      });
    }

    return res.json({
      meta: {
        endPoint: getUrl(req),
        total: results.length,
      },
      data: results,
    });
  },

  postAddCurso: async (req, res) => {
    let disiplina = req.params.disiplina;
    let cursoNuevo = req.body;
    let allCursos = await getAllCursos();



    if (!allCursos.hasOwnProperty(disiplina)) {

      return res.status(404).send('no se puede agregar cursos para esta disiplina');
    } else if (allCursos.hasOwnProperty(disiplina)) {
      if (cursoDe(cursoNuevo).disiplina == `${disiplina}` && !idIsRepeat(allCursos[disiplina], cursoNuevo.id)) {
        postCurso(disiplina, cursoNuevo);
        allCursos = await getAllCursos();
        return res.status(201).json({
          meta: {
            endPoint: getUrl(req),
            message: 'Curso agregado',
          },
          data: allCursos[disiplina],

        });

      } else {
        return res.status(404).json({
          meta: {
            status: 404,
            message: 'el curso que sea agregar no coincide con la disiplina o tiene un id repetido',
          },
        });
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

      putCurso(disiplina, indice, cursoActualizado);
      allCursos = await getAllCursos();
      return res.status(201).json({
        meta: {
          message: 'Curso actualizado',
        
        },
        data: allCursos[disiplina]  
      });

    } else {

      return res.status(404).json({
        message: 'el curso que desea editar no esta en nuestra base de datos',
      });
    };
  },
  patchUpdateCurso: async (req, res) => {
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
      patchCurso(disiplina, id, cursoAModificar);
        return res.status(201).json({
          meta: {
            message: 'curso modificado',
          },
          data: allCursos[disiplina],
        });
      

    } else {
      return res.status(404).json({
        message: 'el curso que desea editar no esta en nuestra base de datos',
      });
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
      return res.json({
        message: 'curso eliminado',
        data: allCursos[disiplina],
      });
    } else {
      return res.status(404).json({
        message: `no se han encontrado cursos de ${disiplina} con el id: ${id}`,
      })
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

