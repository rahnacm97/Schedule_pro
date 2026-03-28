import * as availabilityRepository from "../repositories/availabilityRepository.js";

//Fetch availability
export const getAvailability = async (userId) => {
  return availabilityRepository.findByUserId(userId);
};
//Update availability
export const updateAvailability = async (userId, availabilities) => {
  await availabilityRepository.deleteByUserId(userId);
  for (const avail of availabilities) {
    await availabilityRepository.upsert({
      userId,
      dayOfWeek: parseInt(avail.dayOfWeek),
      startTime: avail.startTime,
      endTime: avail.endTime,
      isEnabled: avail.isEnabled,
    });
  }
  return availabilityRepository.findByUserId(userId);
};
