import express from 'express';
import { adminCursosRouter } from './routers/adminCursosRouter.js';
const app = express();
const PORT = process.env.PORT || 3000;


// routers
app.use('/api/admin/cursos', adminCursosRouter);


// routing
app.get('/', (req, res) => {
    res.send('Server de cursos');
});


app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});