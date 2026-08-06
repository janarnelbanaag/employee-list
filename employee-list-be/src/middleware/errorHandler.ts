import type { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
    status?: number;
    statusCode?: number;
}

export const errorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "An unexpected server error occurred";

    console.error(`[Error Log] ${req.method} ${req.url}:`, err.stack);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message
    })
}