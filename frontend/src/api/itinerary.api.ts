import api from "./axios";

export const getMyItineraries = async () => {
  const response = await api.get("/itinerary");

  return response.data;
};

export const getItineraryById = async (id: string) => {
  const response = await api.get(`/itinerary/${id}`);

  return response.data;
};

export const getSharedItinerary = async (shareId: string) => {
  const response = await api.get(
    `/itinerary/share/${shareId}`
  );

  return response.data;
};