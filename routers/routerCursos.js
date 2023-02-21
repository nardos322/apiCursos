import express from 'express';
import { cursoDe, idIsRepeat } from '../functions/functions.js';
import {createRequire} from 'module';
import { writeFileSync } from 'fs';
const require = createRequire(import.meta.url);
const infoCurso = require('../database/cursos.json');


const routerCursos = express.Router();

routerCursos.use(express.json());


routerCursos.get('/', (req, res) => {
    return res.json(infoCurso);
});

routerCursos.get('/:curso', (req, res) => {
    let curso = req.params.curso;
    if (infoCurso.hasOwnProperty(curso)) {
        return res.json(infoCurso[curso]);
    } else {
        return res.status(404).send('No se encontraron cursos para esa disiplina');
    }

});

routerCursos.get('/:disiplina/:curso/:nivel?', (req, res) => {
    let curso = req.params.curso;
    let disiplina = req.params.disiplina;
    let nivel = req.params.nivel;
    let results;


   if (!infoCurso.hasOwnProperty(disiplina)){
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
        return res.status(404).send(`No se encontraron cursos de ${curso}`);
        
    };
    
    if (req.query.ordenar === 'vistas'){
        
        return res.json(results.sort((a, b) => a.vistas - b.vistas));
    } 

    return res.json(results);
});


routerCursos.post('/:disiplina', (req, res) => {
    let disiplina = req.params.disiplina;
    let cursoNuevo = req.body;
    
    if (!infoCurso.hasOwnProperty(disiplina)) {
        
        return res.status(404).send('no se puede agregar cursos para esta disiplina');
    }else if (infoCurso.hasOwnProperty(disiplina)) {
        if(cursoDe(cursoNuevo).disiplina == 'matematicas' && disiplina == 'matematicas' && !idIsRepeat(infoCurso[disiplina], cursoNuevo.id)){
            
            infoCurso.matematicas.push(cursoNuevo);
            writeFileSync('./database/cursos.json', JSON.stringify(infoCurso))
            return res.json(infoCurso);
        }else if (cursoDe(cursoNuevo).disiplina == 'programacion' && disiplina == 'programacion' && !idIsRepeat(infoCurso[disiplina], cursoNuevo.id)){
            console.log(idIsRepeat(infoCurso[disiplina], cursoNuevo.id))
            infoCurso.programacion.push(cursoNuevo);
            writeFileSync('./database/cursos.json', JSON.stringify(infoCurso))
            return res.json(infoCurso);
        } else {
            return res.status(404).send('el curso que sea agregar no coincide con la disiplina o tiene un id repetido');
        }
    }
    
    
});

routerCursos.put('/:disiplina/:id', (req, res) => {
    const cursoActualizado = req.body;
    const disiplina = req.params.disiplina;
    const id = req.params.id;
    let indice;  


    if(!infoCurso.hasOwnProperty(disiplina)) {
        return res.status(404).send('la disiplina no existe en el servidor');
    } else if(infoCurso.hasOwnProperty(disiplina)) {
        indice = infoCurso[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
        infoCurso[disiplina][indice] = cursoActualizado;
        writeFileSync('./database/cursos.json', JSON.stringify(infoCurso))
        return res.status(201).json(infoCurso);
    } else {
        return res.status(404).send('el curso que desea editar no esta en nuestra base de datos')
    };
    
    
}) ;

routerCursos.patch('/:disiplina/:id', (req, res) => {
    const infoActualizada = req.body;
    const disiplina = req.params.disiplina
    const id = req.params.id;
    let indice;

    if(!infoCurso.hasOwnProperty(disiplina)) {
        return res.status(404).send('la disiplina no existe en el servidor');
    } else if(infoCurso.hasOwnProperty(disiplina)) {
        indice = infoCurso[disiplina].findIndex(curso => curso.id == id);
    }
    if (indice >= 0) {
        const cursoAModificar = infoCurso.programacion[indice];
        Object.assign(cursoAModificar, infoActualizada);
        writeFileSync('./database/cursos.json', JSON.stringify(infoCurso))
        return res.status(201).json(infoCurso);
    } else {
        return res.status(404).send('el curso que desea editar no esta en nuestra base de datos');
    };
    
    
    
});

routerCursos.delete('/:id', (req, res) => {
    const id = req.params.id;
    const indice = infoCurso.programacion.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        infoCurso.programacion.splice(indice, 1);
    };

    res.send(infoCurso);
    
});

export {routerCursos};