<template>
    <div>

        <form class="card comment-form">
          <div class="card-block">
            <textarea
            class="form-control"
            placeholder="Write a comment..."
            v-model="content"
            rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img :src="user.image" class="comment-author-img" />
            <button
            class="btn btn-sm btn-primary"
            @click="postComment($event)">
             Post Comment
            </button>
          </div>
        </form>

        <div class="card" v-for="comment in comments" :key="comment.id">
          <div class="card-block">
            <p class="card-text">{{comment.body}}</p>
          </div>
          <div class="card-footer">
            <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }"
            class="comment-author">
            <img :src="comment.author.image" class="comment-author-img" />
            </nuxt-link>
            &nbsp;
            <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }" class="comment-author">{{comment.author.username}}</nuxt-link>
            <span class="date-posted">{{comment.updatedAt | date('MMM DD, YYYY')}}</span>
            <span class="mod-options">
                <i class="ion-trash-a"
                v-if="comment.author.username === user.username"
                @click="delComment(comment.id)"></i>
            </span>
          </div>
        </div>
    </div>
</template>

<script>
import { createComment, deleteComment, getComments } from '@/api/article';
import { mapState } from 'vuex';

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      content: '',
    };
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted() {
    try {
      const { data: { comments } } = await getComments(this.article.slug);
      this.comments = comments;
    } catch (error) {
      alert(error);
    }
  },
  methods: {
    async postComment(e) {
      e.preventDefault();
      try {
        if (this.content) {
          const { data: { comment } } = await createComment(
            this.article.slug, { comment: { body: this.content } },
          );
          if (comment) {
            this.comments.unshift(comment);
          }
        } else {
          alert('输入内容不能为空！');
        }
      } catch (error) {
        alert(error);
      }
    },
    async delComment(id) {
      try {
        await deleteComment(this.article.slug, id);
        this.comments = this.comments.filter((item) => item.id !== id);
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style>

</style>
