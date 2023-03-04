export const idIsRepeat = (listCursos, newId) => {
    
    for(let i = 0; i < listCursos.length; i++) {
           
        if (listCursos[i].id == newId) {
            return true;
        } 
        
    }
    return false
   
}


export const cursoDe = (curso) => {
    const cursoKeys = Object.keys(curso);
    if(cursoKeys.includes('lenguaje')){
        return {curso: curso.lenguaje, disiplina: 'programacion'};
    }else if (cursoKeys.includes('tema')) {
        return {curso:curso.tema, disiplina: 'matematicas'};
    };
    
};

export const searchForName = (allCursos, nameSearch) => {
    
    let results = []
    console.log(allCursos[1].titulo.toLowerCase().includes(nameSearch))
    for(let i = 0; i < allCursos.length; i++){
       
        if(allCursos[i].titulo.toLowerCase().includes(nameSearch)){
           results.push(allCursos[i]);
           
        }
    };
    return results;
};