<template>
    <div>
        <Header />
        <h1>🗣️公众号</h1>
        <main class="container-fluid">
            <div class="row mt-5">
                <div class="col-lg-8 col-md-12 mx-auto">
                    <div class="card mb-4">
                        <div class="card-header">
                            <h1 style="font-size: 1.5em; margin: 0.5em 0;">传阅·站长精选·每日更新</h1>
                        </div>
                        <div class="card-body">
                            <div id="search-form">
                                <div class="search-container">
                                    <input type="text" v-model="searchQuery" id="search-input-md" placeholder="输入标题、标签、分类、描述...">
                                    <button @click="searchArticles" id="search-button-md">找找看</button>
                                </div>
                            </div>
                            <ul id="article-list-md">
                                <li v-for="article in articles" :key="article.id">
                                    <a :href="article.url" target="_blank">{{ article.title }}</a>
                                </li>
                            </ul>
                            <div id="pagination-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { getWechatArticles } from '@/utils/dbService.js';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            articles: [],
            currentPage: 1,
            searchQuery: ''
        };
    },
    async mounted() {
        await this.loadArticles();
    },
    methods: {
        async loadArticles() {
            this.articles = await getWechatArticles(this.currentPage, 10, this.searchQuery);
        },
        async searchArticles() {
            this.currentPage = 1;
            await this.loadArticles();
        }
    }
};
</script>

<style scoped>
/* 可以添加一些样式 */
.search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}
</style>