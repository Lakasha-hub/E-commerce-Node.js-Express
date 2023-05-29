import { isValidObjectId } from "mongoose";

const verifyMongoID = (req, res, next) => {
  const { id } = req.params;
  const result = isValidObjectId(id);
  if (!result) {
    return res.status(400).json({ error: `The id: ${id} is not valid` });
  }
  next();
};

export { verifyMongoID };
