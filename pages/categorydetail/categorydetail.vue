<template>
    <Header />
    <main class="container-fluid">
      <div class="row mt-3">
        <div class="col-lg-10 col-xl-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="mb-4 fw-bold text-primary">
                <i class="bi bi-tags me-2"></i>
                分类：<span class="text-uppercase">{{ categoryName }}</span>（共 {{ articles.length }} 篇文章）
              </h1>
  
              <div v-if="articles.length > 0" class="list-group">
                <a
                  v-for="(article, index) in articles"
                  :key="index"
                  :href="`/pages/article/article?title=${encodeURIComponent(article.title)}`"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <span>{{ article.title }}</span>
                  <small class="text-muted">{{ formatDate(article.created_at) }}</small>
                </a>
              </div>
  
              <div v-else class="alert alert-info" role="alert">
                当前分类下没有文章。
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </template>
  <script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { getCategoryArticles } from '@/utils/dbService';
  
  export default {
    components: {
      Header,
      Footer
    },
    data() {
      return {
        categoryName: '', // 当前分类名称
        articles: [] // 文章列表
      };
    },
    async created() {
      // 从 URL 参数中获取分类名称
      const query = this.$route.query;
      if (query.name) {
        this.categoryName = decodeURIComponent(query.name);
        await this.fetchCategoryArticles();
      } else {
        console.error('未提供分类名称');
      }
    },
    methods: {
      async fetchCategoryArticles() {
        try {
          const response = await getCategoryArticles(this.categoryName);
  
          if (response && response.articles) {
            this.articles = response.articles;
          } else {
            console.error('未找到该分类的文章数据');
          }
        } catch (error) {
          console.error('Error fetching category articles:', error);
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