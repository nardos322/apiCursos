import mysql from 'mysql2/promise';



export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'cursos_db'
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


// let x = 10

// const p = new Promise((resolve, reject) => {
//     if(x == 10){
//         resolve('La variable es igual a 10');
//     }else{
//         reject('La variable no es igual a 10')
//     }
// })

// p.then(result => {
//     console.log(result)
// })
// .catch(error => {
//     console.log(error)
// })

let x = 10;

// console.log('1. proceso iniciado ...');

// setTimeout(() => {
//     x = x * 3 +2;
//     console.log('2. proceso terminado...');
// }, 2000)

// console.log('3. el restado es: ' + x);

// const promesa = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         x = x * 3 +2;
//         console.log('2. proceso terminado...');
//         resolve(x)
//     }, 2000)
    
// });

// console.log('1. proceso iniciado ...');

// promesa.then(res => console.log('3. El resultado es: ' + res));


// import util from 'util'

// const sleep = util.promisify(setTimeout)

// let name = 'nahuel'
// const nombre = (name) => {
    
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
            
//             resolve(name)
//         },2000);
        
//     })
// }


// nombre(name)
//     .then(data => {
//         console.log(data)
//         nombre(name ='elias')
//     })
//     .then(data => console.log(`hola ${data}`))






// const saludar = async () =>{
    
//     let name = await nombre()
//     return (`hola como estas ${name}`)
   
// }

// let saludo = await saludar()

// console.log(saludo)


