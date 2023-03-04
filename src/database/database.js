import * as dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';



export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    database: process.env.DB_DATABASE,
})



export let getAllCursos = async () => {

    try {
        let matematicas = await pool.query('SELECT * FROM matematicas');
        let programacion = await pool.query('SELECT * FROM programacion');
        let allCursos = { matematicas: matematicas[0], programacion: programacion[0] }
        
        return allCursos
    }catch(err){
        console.log(err)
        
    }

}

export let postCurso = async(disiplina, cursoNuevo) => {
    await pool.query(`INSERT INTO ${disiplina} (titulo,${cursoNuevo.tema? 'tema' : 'lenguaje'},vistas, nivel) VALUES 
    ('${cursoNuevo.titulo}', '${cursoNuevo.tema? cursoNuevo.tema : cursoNuevo.lenguaje}', '${cursoNuevo.vistas}', '${cursoNuevo.nivel}')`);
    
}

export const putCurso = async(disiplina, indice, cursoActualizado) => {
   
   if(cursoActualizado.hasOwnProperty('tema')){
    await pool.query(`UPDATE ${disiplina} SET titulo= '${cursoActualizado.titulo}', tema= '${cursoActualizado.tema}', vistas= '${cursoActualizado.vistas}', nivel= '${cursoActualizado.nivel}' WHERE id = ${indice + 1}`);
   }else if (cursoActualizado.hasOwnProperty('lenguaje')){
    await pool.query(`UPDATE ${disiplina} SET titulo= '${cursoActualizado.titulo}', lenguaje= '${cursoActualizado.lenguaje}', vistas= '${cursoActualizado.vistas}', nivel= '${cursoActualizado.nivel}' WHERE id = ${indice + 1}`);
   }
   
        
}

export const patchCurso = async (disiplina, id, cursoAModificar) => {
    if (cursoAModificar.hasOwnProperty('tema')) {
        await pool.query(`UPDATE ${disiplina} SET id=${cursoAModificar.id}, titulo= '${cursoAModificar.titulo}', tema= '${cursoAModificar.tema}', vistas= '${cursoAModificar.vistas}', nivel= '${cursoAModificar.nivel}' WHERE id = ${id}`);
        
      } else if (cursoAModificar.hasOwnProperty('lenguaje')) {
        await pool.query(`UPDATE ${disiplina} SET id=${cursoAModificar.id}, titulo= '${cursoAModificar.titulo}', lenguaje= '${cursoAModificar.lenguaje}', vistas= '${cursoAModificar.vistas}', nivel= '${cursoAModificar.nivel}' WHERE id = ${id}`);
      
      }

}   
