import express from 'express';
import { routerCursos } from './routers/routerCursos.js';
const app = express();
const PORT = process.env.PORT || 3000;


// routers
app.use('/api/cursos', routerCursos);


// routing
app.get('/', (req, res) => {
    res.send('Server de cursos');
});


app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});