import { request } from '@/plugins/request';

export const getProfile = (username) => request({
  url: `/api/profiles/${username}`,
  method: 'GET',
});

export default {};
