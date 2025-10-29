import API from "./api";

export const getDailyTasks = () => API.get("/daily");
export const getChecklists = () => API.get("/checklists");

export const completeTask = (id) => API.patch(`/checklists/${id}/complete`);
export const uncheckTask = (id) => API.patch(`/checklists/${id}/uncheck`);
