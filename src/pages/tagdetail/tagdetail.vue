<template>
    <Header />
    <main class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-8 col-md-12 mx-auto">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">首页</a></li>
              <li class="breadcrumb-item"><a href="/pages/tag/tag">标签列表</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ tagName }}</li>
            </ol>
          </nav>
          <h1 style="font-size: 1.5em; margin: 0.5em 0;">
            {{ tagName }} 标签的文章和资讯
          </h1>
          <div class="masonry-grid">
            <div
              v-for="(article, index) in articles"
              :key="index"
              class="masonry-grid-item"
            >
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="bi bi-file-earmark-text"></i>
                    <a
                      :href="`/pages/article/article?title=${encodeURIComponent(article.title)}`"
                      class="text-decoration-none"
                    >
                      {{ article.title }}
                    </a>
                  </h5>
                  <p v-if="article.description" class="card-text">
                    {{ article.description }}
                  </p>
                  <small class="text-muted">
                    {{ formatDate(article.created_at) }}
                  </small>
                </div>
                <div class="card-footer text-muted">
                  <a
                    :href="`/pages/category/category?name=${encodeURIComponent(article.category.trim())}`"
                    class="badge bg-primary"
                  >
                    {{ article.category }}
                  </a>
                  <a
                    v-for="(tag, idx) in article.tags"
                    :key="idx"
                    :href="`/pages/tagdetail/tagdetail?name=${encodeURIComponent(tag.trim())}`"
                    class="badge tag-link"
                  >
                    {{ tag.trim() }}
                  </a>
                </div>
              </div>
            </div>
          </div>
  
          <div class="mt-4 text-center">
            <a href="/pages/tag/tag" class="btn btn-outline-primary">
              <i class="bi bi-arrow-left"></i> 返回标签列表
            </a>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </template>
  <script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { getTagArticles } from '@/services/dbService';
  
  export default {
    components: {
      Header,
      Footer
    },
    data() {
      return {
        tagName: '', // 当前标签名称
        articles: [] // 文章列表
      };
    },
    async created() {
      // 从 URL 参数中获取标签名称
      const query = this.$route.query;
      if (query.name) {
        this.tagName = decodeURIComponent(query.name);
        await this.fetchTagArticles();
      } else {
        console.error('未提供标签名称');
      }
    },
    methods: {
      async fetchTagArticles() {
        try {
          const response = await getTagArticles(this.tagName);
  
          if (response && response.articles) {
            this.articles = response.articles;
          } else {
            console.error('未找到该标签的文章数据');
          }
        } catch (error) {
          console.error('Error fetching tag articles:', error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`;
      }
    }
  };
  </script>