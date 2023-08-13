import { isValidObjectId } from "mongoose";
import ErrorService from "../services/error.service.js";
import { ErrorManager } from "../constants/errors/index.js";

const verifyMongoID = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = isValidObjectId(id);
    if (!result) {
      ErrorService.create({
        name: "Error validating id",
        cause: ErrorManager.carts.invalidMongoId(id),
        code: ErrorManager.codes.INVALID_VALUES,
        message: `The id: ${id} is not valid`,
        status: 400,
      });
    }
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

export { verifyMongoID };
