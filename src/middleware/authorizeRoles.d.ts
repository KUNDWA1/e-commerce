import { Request, Response, NextFunction } from "express";
/**
 * Role-Based Access Control Middleware
 * Usage: authorizeRoles("admin"), authorizeRoles("admin", "vendor")
 */
export declare const authorizeRoles: (...roles: Array<"admin" | "vendor" | "customer">) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authorizeRoles.d.ts.map