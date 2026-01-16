import { Request, Response, NextFunction } from "express";
/**
 * AUTHENTICATION
 * Checks if user is logged in
 */
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * AUTHORIZATION (RBAC)
 * Restricts access based on roles
 */
export declare const authorizeRoles: (...roles: Array<"admin" | "vendor" | "customer">) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map