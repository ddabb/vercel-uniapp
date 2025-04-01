<template>
  <Header />
  <view class="container-fluid">
    <view class="row mt-5">
      <view class="col-lg-8 col-md-12 mx-auto">
        <view class="card mb-4">
          <view class="card-header">
            <text style="font-size: 1.5em; margin: 0.5em 0;">传阅·站长精选·每日更新</text>
          </view>
          <view class="card-body">
            <view id="search-form">
              <view class="search-container">
                <input type="text" v-model="keyword" placeholder="输入标题、标签、分类、描述..." @confirm="onSearch" />
                <button @click="onSearch">找找看</button>
              </view>
            </view>
            <ul id="article-list-md">
              <li v-for="(article, index) in articles" :key="index" class="article-container">
                <span class="article-category" @click="navigateToCategory(article.category)">
                  {{ article.category }}
                </span>
                <view @click="goToArticle(article.title)">
                  {{ article.title }}
                </view>
                <span class="article-date">{{ formatDate(article.created_at) }}</span>
              </li>
            </ul>
            <view id="pagination-md">
              <!-- 分页控件 -->
              <block v-for="(page, index) in paginationPages" :key="index">
                <button @click="goToPage(page.pageNumber)" :class="{ active: page.isActive }">
                  {{ page.text }}
                </button>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { getMdFiles } from  '@/utils/dbService'; // 引入新的查询方法

export default {
  data() {
    return {
      keyword: '',
      articles: [],
      currentPage: 1,
      pageSize: 12,
      totalPages: 1,
      paginationPages: []
    };
  },
  components: {
    Header,
    Footer
  },
  methods: {
    goToArticle(title) {
      uni.navigateTo({
        url: `/pages/article/article?title=${encodeURIComponent(title)}`
      });
    },
    createPagination() {
      this.paginationPages = [];
      let startPage = Math.max(1, this.currentPage - 3);
      let endPage = Math.min(this.totalPages, startPage + 6);

      if (startPage > 1) {
        this.paginationPages.push({ text: '首页', pageNumber: 1 });
        this.paginationPages.push({ text: '...', pageNumber: null });
      }

      for (let i = startPage; i <= endPage; i++) {
        this.paginationPages.push({ text: i.toString(), pageNumber: i, isActive: i === this.currentPage });
      }

      if (endPage < this.totalPages) {
        this.paginationPages.push({ text: '...', pageNumber: null });
        this.paginationPages.push({ text: '末页', pageNumber: this.totalPages });
      }
    },
    goToPage(pageNumber) {
      if (pageNumber !== null) {
        this.fetchArticles(this.keyword, pageNumber);
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    navigateToCategory(category) {
      uni.navigateTo({
        url: `/pages/category/${encodeURIComponent(category)}`
      });
    },
    async onSearch() {
      this.currentPage = 1; // 搜索时重置到第一页
      await this.fetchArticles(this.keyword, 1);
    },
    async fetchArticles(keyword = '', page = 1) {
      try {
        const response = await getMdFiles(page, this.pageSize, keyword);

        // 更新数据
        this.articles = response.articles;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;

        // 创建分页
        this.createPagination();
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
  },
  created() {
    this.fetchArticles('', 1); // 初始化加载数据
  }
};
</script>
<style scoped>
/* 核心布局调整 */
.container-fluid {
  padding: 0 20rpx;
  /* 增加左右内边距 */
}

.row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rpx 0;
}

/* 卡片容器优化 */
.card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 40rpx;
}

.card-header {
  padding: 30rpx 20rpx 10rpx;
  border-bottom: 1px solid #eee;
}

/* 搜索区域优化 */
.search-container {
  display: flex;
  gap: 20rpx;
  margin: 30rpx 0;
}

input[type="text"] {
  flex: 1;
  height: 80rpx;
  padding: 0 30rpx;
  border-radius: 40rpx;
  border: 1px solid #eee;
  font-size: 28rpx;
}

button {
  padding: 0 40rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #007bff;
  color: white;
  border: none;
  font-size: 28rpx;
}

/* 文章列表优化 */
.article-container {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  border-bottom: 1px solid #eee;
}

/* 移动端隐藏分类和日期 */
@media (max-width: 768px) {
  .article-category,
  .article-date {
    display: none !important;
  }
  
  .article-container > view {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.article-category {
  display: inline-block;
  background: #f0f0f0;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.article-title {
  font-size: 32rpx;
  color: #333;
  margin: 10rpx 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-date {
  font-size: 24rpx;
  color: #999;
  margin-left: auto;
}

/* 分页控件优化 */
#pagination-md {
  display: flex;
  justify-content: center;
  gap: 15rpx;
  padding: 40rpx 0;
}

button[active] {
  background: #007bff;
  color: white;
  border-radius: 30rpx;
  padding: 15rpx 40rpx;
}

button:not([active]) {
  background: #f5f5f5;
  color: #666;
  border-radius: 30rpx;
  padding: 15rpx 40rpx;
}
</style>