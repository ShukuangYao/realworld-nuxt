<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profile.image" class="user-img" />
          <h4>{{profile.username}}</h4>
          <p>
            {{profile.bio}}
          </p>
          <button
            class="btn btn-sm action-btn"
            :class="{
              'btn-secondary': profile.following,
              'btn-outline-secondary': !profile.following,
            }"
            v-if="profile.username !== user.username" @click="dealFollow($event)">
            <i class="ion-plus-round"></i>
            &nbsp;
            <span v-if="profile.following">Unfollow</span>
            <span v-else>Follow</span> {{profile.username}}
          </button>
          <nuxt-link class="btn btn-sm btn-outline-secondary action-btn" :to="{
            name: 'settings',
          }" v-else>
            <i class="ion-gear-a"></i> Edit Profile Settings
          </nuxt-link>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link
              class="nav-link"
              :class="{active: !favorited}"
              exact
              :to="{
                name: 'profile',
                params:{
                  username: profile.username,
                }
              }">My Articles</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
              class="nav-link"
              :class="{active: favorited}"
              exact
              :to="{
                name: 'profile',
                params:{
                  username: profile.username,
                },
                query:{
                  favorited: true,
                }
              }">Favorited Articles</nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview" v-for="article in articles"
        :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params:{
                username: article.author.username
              }
            }"><img :src="article.author.image" /></nuxt-link>
            <div class="info">
              <nuxt-link :to="{
                name: 'profile',
                params:{
                  username: article.author.username
                }
              }" class="author">{{article.author.username}}</nuxt-link>
              <span class="date">{{article.updatedAt | date('MMM DD, YYYY')}}</span>
            </div>

            <button
            class="btn btn-outline-primary btn-sm pull-xs-right"
            :class="{
              active: article.favorited
            }"
            @click="dealFavor($event, article)"
            :disabled="article.favoriteDisabled"
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
                    name: 'profile',
                    params:{
                      username: profile.username,
                    },
                    query:{
                      favorited,
                      page: item,

                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getProfile } from '@/api/profile';
import { listArticles, favoriteArticle, unfavoriteArticle } from '@/api/article';
import { mapState } from 'vuex';
import { followUser, unfollowUser } from '@/api/user';

export default {
  middleware: 'authenticated',
  name: 'profile',
  async asyncData({ query, params }) {
    const limit = 5;
    const { username } = params;
    const { favorited, page = 1 } = query;
    const [{ data: { profile } },
      { data: { articles = [], articlesCount = 0 } }] = await Promise.all([
      getProfile(username),
      listArticles({
        limit,
        offset: (page - 1) * limit,
        [favorited ? 'favorited' : 'author']: username,
      }),
    ]);
    return {
      profile,
      favorited,
      page,
      articles: articles.map((item) => ({ ...item, favoriteDisabled: false })),
      articlesCount,
      limit,
      username,
    };
  },
  watchQuery: ['favorited', 'page', 'username'],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async dealFollow(e) {
      e.preventDefault();
      const { username, following: prevFollowing } = this.profile;
      const delFollowHandler = prevFollowing ? unfollowUser : followUser;
      try {
        const {
          data: { profile: { following } },
        } = await delFollowHandler(username);
        this.profile.following = following;
      } catch (error) {
        alert(error);
      }
    },
    async dealFavor(e, article) {
      article.favoriteDisabled = true;
      e.preventDefault();
      const delFavoriteHandler = article.favorited ? unfavoriteArticle : favoriteArticle;
      try {
        const {
          data: { article: { favorited, favoritesCount } },
        } = await delFavoriteHandler(article.slug);
        article.favorited = favorited;
        article.favoritesCount = favoritesCount;
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
