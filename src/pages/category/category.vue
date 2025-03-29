<template>
    <Header />
    <main class="container-fluid">
        <div class="row mt-3">
            <div class="col-lg-10 col-xl-8 mx-auto">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h1 class="mb-4 fw-bold text-primary">
                            <i class="bi bi-tags me-2"></i>
                            所有分类（共 {{ categories.length }} 个）
                        </h1>

                        <div class="d-flex flex-wrap gap-2">
                            <a v-for="(category, index) in sortedCategories" :key="index"
                                :href="`/pages/categorydetail/categorydetail?name=${encodeURIComponent(category.name)}`"
                                class="text-decoration-none d-inline-flex align-items-center rounded-3 overflow-hidden shadow-sm hover-shadow"
                                style="height: 28px; line-height: 1;">
                                <span class="bg-primary text-white px-2 h-100 d-flex align-items-center">
                                    {{ category.name }}
                                </span>
                                <span class="bg-secondary text-white px-2 h-100 d-flex align-items-center">
                                    {{ category.count }}
                                </span>
                            </a>
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
import { getCategories } from '@/services/dbService';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            categories: [] // 分类列表
        };
    },
    computed: {
        sortedCategories() {
            // 按数量降序排序
            return this.categories.sort((a, b) => b.count - a.count);
        }
    },
    async created() {
        await this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await getCategories();

                if (response && response.categories) {
                    this.categories = Object.keys(response.categories).map(categoryName => ({
                        name: categoryName,
                        count: response.categories[categoryName]
                    }));
                } else {
                    console.error('未找到分类数据');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    }
};
</script>