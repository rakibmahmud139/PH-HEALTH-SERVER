import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
import httpStatus from "http-status";

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = verifyToken(token, config.jwt.jwt_secret as Secret);

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "FORBIDDEN!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
