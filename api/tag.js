import { request } from '@/plugins/request';

export default {};

export const getTags = () => (request({
  url: '/api/tags',
  method: 'GET',
}));
