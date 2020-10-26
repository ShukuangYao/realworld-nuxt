import { request } from '@/plugins/request';

export const login = (data) => request({
  url: '/api/users/login',
  method: 'POST',
  data,
});

export const register = (data) => request({
  url: '/api/users',
  method: 'POST',
  data,
});

export const getUser = () => request({
  url: '/api/user',
  method: 'GET',
});

export const updateUser = (data) => request({
  url: '/api/user',
  method: 'PUT',
  data,
});

export const followUser = (username) => request({
  url: `/api/profiles/${username}/follow`,
  method: 'POST',
});

export const unfollowUser = (username) => request({
  url: `/api/profiles/${username}/follow`,
  method: 'DELETE',
});
