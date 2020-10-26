import { request } from '@/plugins/request';

export const listArticles = (params) => (request({
  url: '/api/articles',
  method: 'GET',
  params,
}));

export const feedArticles = (params) => (request({
  url: '/api/articles/feed',
  method: 'GET',
  params,
}));

export const getArticle = (slug) => (request({
  url: `/api/articles/${slug}`,
  method: 'GET',
}));

export const getComments = (slug) => (request({
  url: `/api/articles/${slug}/comments`,
  method: 'GET',
}));

export const deleteComment = (slug, id) => (request({
  url: `/api/articles/${slug}/comments/${id}`,
  method: 'DELETE',
}));

export const createComment = (slug, data) => (request({
  url: `/api/articles/${slug}/comments`,
  method: 'POST',
  data,
}));

export const createArticle = (data) => (request({
  url: '/api/articles',
  method: 'POST',
  data,
}));

export const updateArticle = (data) => (request({
  url: `/api/articles/${data.article.slug}`,
  method: 'PUT',
  data,
}));

export const deleteArticle = (slug) => (request({
  url: `/api/articles/${slug}`,
  method: 'DELETE',
}));

export const favoriteArticle = (slug) => (request({
  url: `/api/articles/${slug}/favorite`,
  method: 'POST',
}));

export const unfavoriteArticle = (slug) => (request({
  url: `/api/articles/${slug}/favorite`,
  method: 'DELETE',
}));
