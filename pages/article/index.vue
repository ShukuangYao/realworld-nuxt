<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{article.title}}</h1>
      <article-meta
      :article="article"
      @update-following="updateFollowing"
      @update-favorited="updateFavorited"/>
    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12" v-html="article.body">
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <article-meta
      :article="article"
      @update-following="updateFollowing"
      @update-favorited="updateFavorited"/>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <article-comments :article="article"/>

      </div>
    </div>

  </div>

</div>
</template>

<script>
import {
  getArticle,
} from '@/api/article';
import MarkdownIt from 'markdown-it';
import ArticleMeta from './components/article-meta';
import ArticleComments from './components/article-comments';

export default {
  name: 'article',
  async asyncData({ params, store }) {
    const { slug } = params;
    const { data: { article } } = await getArticle(slug);
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article,
    };
  },
  components: {
    ArticleMeta,
    ArticleComments,
  },
  methods: {
    updateFollowing(following) {
      this.article.author.following = following;
    },
    updateFavorited(favorited) {
      this.article.favorited = favorited;
      if (favorited) {
        this.article.favoritesCount += 1;
      } else {
        this.article.favoritesCount -= 1;
      }
    },
  },
};
</script>

<style>

</style>
