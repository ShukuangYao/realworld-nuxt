<template>
    <div class="article-meta">
    <nuxt-link :to="{
        name: 'profile',
        params: {
            username:article.author.username
        }
        }"><img :src="article.author.image" /></nuxt-link>
    <div class="info">
        <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
            username:article.author.username
        }
        }">{{article.author.username}}</nuxt-link>
        <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="article.author.username !== user.username">
      <button
          class="btn btn-sm"
          :class="{
              'btn-secondary': article.author.following,
              'btn-outline-secondary': !article.author.following,
          }"
          @click="delFollow($event)"
      >
          <i class="ion-plus-round"></i>
          &nbsp;
          <span v-if="article.author.following">Unfollow</span>
          <span v-else>Follow</span> {{article.author.username}}
      </button>
      &nbsp;&nbsp;
      <button
          class="btn btn-sm btn-outline-primary"
          :class="{
              active: article.favorited
          }"
          :disabled="favoriteDisabled"
          @click="delFavorite($event)"
      >
          <i class="ion-heart"></i>
          &nbsp;
          Favorite Post <span class="counter">({{article.favoritesCount || 0}})</span>
      </button>
    </template>
    <template v-else>
      <button
          class="btn btn-outline-secondary btn-sm"
          @click="editArticle($event)"
      >
          <i class="ion-edit"></i>
          Edit Article
      </button>
      &nbsp;&nbsp;
      <button
          class="btn btn-outline-danger btn-sm"
          :disabled="favoriteDisabled"
          @click="delArticle($event)"
      >
          <i class="ion-trash-a"></i>
          Delete Article
      </button>
    </template>
    </div>
</template>

<script>
import { followUser, unfollowUser } from '@/api/user';
import { favoriteArticle, unfavoriteArticle, deleteArticle } from '@/api/article';
import { mapState } from 'vuex';

export default {
  name: 'articleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      favoriteDisabled: false,
    };
  },
  computed: {
    ...mapState(['user']),
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [{
        hid: 'description', name: 'description', content: this.article.description,
      }],
    };
  },
  methods: {
    async delFollow(e) {
      e.preventDefault();
      const delFollowHandler = this.article.author.following ? unfollowUser : followUser;
      try {
        const {
          data: { profile: { following } },
        } = await delFollowHandler(this.article.author.username);
        this.$emit('update-following', following);
      } catch (error) {
        alert(error);
      }
    },
    async delFavorite(e) {
      e.preventDefault();
      this.favoriteDisabled = true;
      const delFavoriteHandler = this.article.favorited ? unfavoriteArticle : favoriteArticle;
      try {
        const { data: { article } } = await delFavoriteHandler(this.article.slug);
        this.$emit('update-favorited', article.favorited);
      } catch (error) {
        alert(error);
      } finally {
        this.favoriteDisabled = false;
      }
    },
    editArticle(e) {
      this.$router.push({
        name: 'editor',
        query: {
          slug: this.article.slug,
        },
      });
    },
    async delArticle(e) {
      try {
        const res = await deleteArticle(this.article.slug);
        this.$router.replace({
          name: 'home',
        });
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style>

</style>
