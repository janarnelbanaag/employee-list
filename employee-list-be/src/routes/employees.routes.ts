import express, { type NextFunction, type Request, type Response } from "express"
import pool from "../config/db.ts";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await pool.query("SELECT * FROM employees")

        res.status(200).json({
            success: true,
            status: 200,
            message: "success",
            employees: employees.rows,
        })
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const employees = await pool.query(`SELECT * FROM employees WHERE id = $1`, [id])

        res.status(200).json({
            success: true,
            status: 200,
            message: "success",
            employee: employees.rows[0],
        })
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const {
            name,
            position,
            startDate,
            endDate,
            employment
        } = req.body

        const employee = await pool.query(`
            UPDATE employees
                SET
                    name = $1,
                    position = $2,
                    start_date = $3,
                    end_date = $4,
                    employment = $5
                WHERE id = $6
                RETURNING *    
        `, [
            name,
            position,
            startDate,
            endDate,
            employment,
            id
        ])

        if (employee.rowCount === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Employee not found"
            })
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: "Employee updated",
            employee: employee.rows[0]
        })
    } catch (error) {
        next(error)
    }
})

router.patch('/:id', async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        
        const validKeys: Record<string, string> = {
            name: "name",
            position: "position",
            startDate: "start_date",
            endDate: "end_date",
            employment: "employment"
        }

        const updates: string[] = [];
        const values: string[] = [];

        Object.entries<string>(req.body)
            .forEach(([key, val]) => {
                if (validKeys[key]) {
                    updates.push(`${validKeys[key]} = $${values.length + 1}`)
                    values.push(val)
                }
            })
        
        values.push(id)

        const employee = await pool.query(`
            UPDATE employees
                SET ${updates.join(", ")}
                WHERE id = $${values.length}
                RETURNING *
        `, values)

        if (employee.rowCount === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Employee not found"
            })
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: "Employee updated",
            employee: employee.rows[0]
        })
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const employee = await pool.query(`DELETE FROM employees WHERE id = $1 RETURNING *`, [id])

        if (employee.rowCount === 0) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Employee not found"
            })
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: "success",
            employee: employee.rows[0]
        })
    } catch (error) {
        next(error)
    }
})

export default router;