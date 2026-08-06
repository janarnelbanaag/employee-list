import express, { type Express } from 'express';
import employees from './routes/employees.routes.ts'
import { errorHandler } from './middleware/errorHandler.ts';

const app: Express = express();

// middlewares
app.use(express.json())

app.use('/api/employee', employees);

app.use(errorHandler)

app.listen(3000);