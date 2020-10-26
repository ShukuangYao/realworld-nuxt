<template>

  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                class="nav-link"
                :class="{active: tab === 'your_feed'}"
                :to="{
                  name: 'home',
                  query:{
                    tab: 'your_feed'
                  }
                }"
                exact
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                class="nav-link"
                :class="{active: tab === 'global_feed'}"
                :to="{
                  name: 'home',
                  query:{
                    tab: 'global_feed'
                  }
                }"
                exact>Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                class="nav-link active"
                :class="{active: tab === 'global_feed'}"
                :to="{
                  name: 'home',
                  query:{
                    tab: 'tag',
                    tag
                  }
                }"
                exact>#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
              <img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }" class="author">
                {{article.author.username}}</nuxt-link>
                <!-- <span class="date">{{article.createdAt}}</span> -->
                <span class="date">{{article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                :disabled="article.favoriteDisabled"
                @click="handleFavorite(article, $event)"
                >
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }" class="preview-link">
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: $route.query.tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                  }
                }"
                class="tag-pill tag-default"
                >
                {{item}}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  listArticles, feedArticles, favoriteArticle, unfavoriteArticle,
} from '@/api/article';
import { getTags } from '@/api/tag';
import { mapState } from 'vuex';

export default {
  name: 'HomeIndex',
  async asyncData({ query, store }) {
    const limit = 10;
    const page = Number.parseInt(query.page || 1, 10);
    const { tab, tag } = query;
    const queryArticles = store.state.user && tab === 'your_feed' ? feedArticles : listArticles;
    const [articleRes, tagRes] = await Promise.all([
      queryArticles({
        limit,
        offset: (page - 1) * limit,
        tag,
      }), getTags()]);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    return {
      articles: articles.map((item) => ({ ...item, favoriteDisabled: false })),
      articlesCount,
      limit: 10,
      page,
      tags,
      tag,
      tab: query.tab || 'global_feed',
    };
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async handleFavorite(article, e) {
      if (e) {
        e.preventDefault();
      }
      const { favorited, slug } = article;
      const handler = favorited ? unfavoriteArticle : favoriteArticle;
      article.favoriteDisabled = true;
      try {
        await handler(slug);
        if (favorited) {
          article.favorited = false;
          article.favoritesCount -= 1;
        } else {
          article.favorited = true;
          article.favoritesCount += 1;
        }
      } catch (error) {
        alert(error);
      } finally {
        article.favoriteDisabled = false;
      }
    },
  },
};
</script>

<style>

</style>
