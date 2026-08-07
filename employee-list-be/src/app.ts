import express, { type Express, type Request, type Response } from 'express';
import employees from './routes/employees.routes.ts'
import { errorHandler } from './middleware/errorHandler.ts';
import pool from './config/db.ts';

const app: Express = express();

// middlewares
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => res.sendStatus(200));

app.get('/ready', async (_req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            backend: "ready",
            database: "ready"
        })
    } catch (error) {
        res.status(503).json({
            backend: "ready",
            database: "not ready"
        })
    }
});

app.use('/api/employee', employees);

app.use(errorHandler)

app.listen(3000, () => {
    console.log(`Backend running on port: 3000`)
});