import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@swap/types';

export function success<T>(res: Response, data: T, statusCode: number = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

export function paginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
  statusCode: number = 200,
): void {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };
  res.status(statusCode).json(response);
}
