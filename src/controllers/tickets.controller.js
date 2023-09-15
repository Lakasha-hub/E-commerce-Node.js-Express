import { ticketsService } from "../services/repositories/index.js";

const getTicketsById = async (req, res) => {
  const { email } = req.user;

  const result = await ticketsService.getAllBy({ purchaser: email });
  return res.sendSuccessWithPayload(result);
};

export { getTicketsById };
