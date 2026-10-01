import apiClient from "./axiosConfig";

export const userProblemsAPI = {
    createUserProblem: (problemData) =>
        apiClient.post("/userproblems", problemData),
};