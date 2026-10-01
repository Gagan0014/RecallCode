import apiClient from './axiosConfig'

export const authAPI = {
  register: (email, password, name, leetcodeUsername = '') =>
    apiClient.post('/auth/register', {
      email,
      password,
      name,
      leetcodeUsername,
    }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getProfile: () =>
    apiClient.get('/auth/profile'),

  updatePreferences: (preferences) =>
    apiClient.post('/auth/preferences', preferences),
}
