<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
           <li v-for="(message, index) in messages" :key="index+field">
             {{field}} {{message}}
           </li>
          </template>
        </ul>
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input
                type="text"
                class="form-control form-control-lg"
                placeholder="Article Title"
                v-model="article.title">
            </fieldset>
            <fieldset class="form-group">
                <input
                type="text"
                class="form-control"
                placeholder="What's this article about?"
                v-model="article.description">
            </fieldset>
            <fieldset class="form-group">
                <textarea
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)" v-model="article.body"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input
                type="text"
                class="form-control"
                placeholder="Enter tags"
                @keydown.enter="addTag()"
                v-model="content"
                >
                <div class="tag-list">
                  <span
                  class="tag-default tag-pill ng-binding ng-scope"
                  v-for="tag in article.tagList"
                  :key="tag">
                    <i class="ion-close-round" @click="removeTag(tag)"></i>{{tag}}
                  </span>

                  </div>
            </fieldset>
            <button
            class="btn btn-lg pull-xs-right btn-primary"
            type="button"
            :disabled="loading"
            @click="publishArticle"
            >
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from '@/api/article';

export default {
  middleware: 'authenticated',
  name: 'editor',
  data() {
    return {
      article: {
        tagList: [],
        title: '',
        description: '',
        body: '',
      },
      content: '',
      loading: false,
      errors: {},
    };
  },
  async mounted() {
    const { query: { slug } } = this.$route;
    if (slug) {
      const { data: { article } } = await getArticle(slug);
      this.article = article;
    }
  },
  methods: {
    addTag() {
      if (this.content && this.article.tagList.indexOf(this.content) === -1) {
        this.article.tagList.push(this.content);
        this.content = '';
      }
    },
    removeTag(tag) {
      this.article.tagList = this.article.tagList.filter((item) => item !== tag);
    },
    async publishArticle() {
      const { query: { slug: s } } = this.$route;
      const handler = s ? updateArticle : createArticle;
      try {
        const { data: { article: { slug } } } = await handler({
          article: this.article,
        });
        this.$router.push({
          name: 'article',
          params: {
            slug,
          },
        });
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>

<style>

</style>
