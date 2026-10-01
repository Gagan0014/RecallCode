import apiClient from './axiosConfig'

export const problemsAPI = {
  // Get all user's problems
  getUserProblems: () =>
    apiClient.get('/problems/myproblems'),
  
  // Get problems due for review
  getDueProblems: () =>
    apiClient.get('/problems/due'),
  
  // Create new problem
  createProblem: (problemData) =>
    apiClient.post('/problems', problemData),
  
  // Rate a problem (SM-2 update)
  rateProblem: (problemId, rating) =>
    apiClient.post('/problems/rate', { problemId, rating }),
  
  // Sync with LeetCode
  syncLeetCode: (leetcodeUsername) =>
    apiClient.post('/sync/sync', { leetcodeUsername }),
}
