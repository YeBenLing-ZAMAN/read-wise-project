import { NextFunction, Request, Response } from 'express'
import ApiError from '../../errors/apiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../helper/jwtHelpers'
import config from '../../config'
import { Secret } from 'jsonwebtoken'

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      console.log(`token:`, token)
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized.')
      }

      // verify token
      let verifiedUser = null
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)

      req.user = verifiedUser

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
