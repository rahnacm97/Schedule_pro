import * as availabilityService from "../services/availabilityService.js";
import HttpStatus from "../shared/enums/httpStatus.js";
import SuccessMessages from "../shared/enums/successMessages.js";

//Fetch availability
export const getAvailability = async (req, res) => {
  try {
    const availabilities = await availabilityService.getAvailability(
      req.userId,
    );
    res.status(HttpStatus.OK).json(availabilities);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
//Update availability
export const updateAvailability = async (req, res) => {
  try {
    const { availabilities } = req.body;
    const updated = await availabilityService.updateAvailability(
      req.userId,
      availabilities,
    );
    res.status(HttpStatus.OK).json({
      message: SuccessMessages.AVAILABILITY_UPDATED,
      data: updated,
    });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
