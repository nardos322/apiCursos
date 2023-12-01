import express from 'express';
import { adminRouter } from './routes/adminRouter.js';
import { usersRouter } from './routes/usersRouter.js';
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// routers
app.use('/api/admin/cursos', adminRouter);
app.use('/api/users', usersRouter);


// routing
app.get('/api', (req, res) => {
    res.send('API de cursos');
});

app.get('/api/admin', (req, res) => {
    res.send('Bienvenido a la ruta de administrador');
});


app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});



