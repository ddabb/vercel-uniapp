<template>
  <Header />
  <main class="container-fluid">
    <div class="row mt-5">
      <div class="col-lg-8 col-md-12 mx-auto">
        <div class="card">
          <div class="card-body">
            <div id="article-content">
              <!-- Breadcrumb -->
              <nav v-if="meta && meta.category" aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <navigator url="/" open-type="navigate" class="text-decoration-none">首页</navigator>
                  </li>
                  <li class="breadcrumb-item">
                    <navigator url="/pages/category/category" open-type="navigate" class="text-decoration-none">
                      分类列表
                    </navigator>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    <navigator :url="`/pages/categorydetail/categorydetail?name=${encodeURIComponent(meta.category)}`"
                      open-type="navigate" class="text-decoration-none">
                      {{ meta.category }}
                    </navigator>
                  </li>
                </ol>
              </nav>

              <!-- Article Content -->
              <div v-html="articleContent"></div>

              <!-- QR Code -->
              <div class="qr-code mt-4">
                <h5>扫描二维码查看</h5>
                <widget-qrcode id="pageQrCode" template="heart" width="180" height="180" foreground-color="#1A237E"
                  inner-color="#FF6D00" outer-color="#1A237E" logo="../logo.png"
                  :value="`https://www.60score.com/mdhtml/${encodeURIComponent(meta.title)}.html`"></widget-qrcode>
              </div>

              <!-- 商品信息 -->
              <div v-if="meta.goodsInfo && Object.keys(meta.goodsInfo).length > 0" class="product-card mt-4">
                <a :href="meta.goodsInfo.showurl" target="_blank" rel="nofollow">
                  <img :src="meta.goodsInfo.picLink" :alt="meta.goodsInfo.name" />
                  <p>{{ meta.goodsInfo.name }}</p>
                  <p>月销量：{{ meta.goodsInfo.monthSale }}</p>
                  <p class="card-text">单价：<span class="price-highlight">{{ meta.goodsInfo.unitprice }}</span> 元</p>
                </a>
              </div>

              <!-- 标签 -->
              <div v-if="meta.tags && meta.tags.length > 0" class="tag-links mt-4">
                <span class="badge tag-label"><i class="bi bi-tags"></i> 标签：</span>
                <a v-for="(tag, index) in meta.tags" :key="index" :href="`/tag/${encodeURIComponent(tag.trim())}.html`"
                  class="badge tag-link">
                  {{ tag.trim() }}
                </a>
              </div>
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
import { getMdFiles } from '@/utils/dbService';;

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: '', // 文章标题（从路由参数中获取）
      articleContent: '', // 文章内容
      meta: {
        title: '',
        description: '',
        category: '',
        tags: [],
        goodsInfo: {},
        updateTime: ''
      }
    };
  },
  onLoad(options) {
    // 获取路由参数中的 title
    this.title = decodeURIComponent(options.title);

    // 调用接口获取文章信息
    this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      try {
        const response = await getMdFiles(1, 1, this.title); // 精准匹配 title

        if (response.articles && response.articles.length > 0) {
          const article = response.articles[0];
          this.meta = {
            title: article.title,
            description: article.description || '暂无描述',
            category: article.category || '未分类',
            tags: article.tags || [],
            goodsInfo: article.goodsInfo || {},
            updateTime: article.updated_at || new Date()
          };

          // 假设 content 是 Markdown 内容，使用 marked.js 渲染为 HTML
          this.articleContent = article.content; // 如果需要渲染 Markdown，请引入 marked.js
        } else {
          console.error('未找到匹配的文章');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    }
  }
};
</script>