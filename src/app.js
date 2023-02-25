import express from 'express';
import { adminCursosRouter } from './routes/adminCursosRouter.js';
const app = express();
const PORT = process.env.PORT || 3000;


// routers
app.use('/api/admin/cursos', adminCursosRouter);

app.use(express.json());


// routing
app.get('/api', (req, res) => {
    res.send('API de cursos');
});

app.get('/api/admin', (req, res) => {
    res.send('Bienvenido a la ruta de administrador')
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});



