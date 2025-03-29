<template>
    <Header />
    <main class="container-fluid">
      <div class="row mt-3">
        <div class="col-lg-10 col-xl-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-body">
              <h1 class="mb-4 fw-bold text-primary">
                <i class="bi bi-tags me-2"></i>
                所有标签（共 {{ tags.length }} 个）
              </h1>
  
              <div class="d-flex flex-wrap gap-2">
                <a
                  v-for="(tag, index) in sortedTags"
                  :key="index"
                  :href="`/pages/tagdetail/tagdetail?name=${encodeURIComponent(tag.name)}`"
                  class="text-decoration-none d-inline-flex align-items-center rounded-3 overflow-hidden shadow-sm hover-shadow"
                  style="height: 28px; line-height: 1;"
                >
                  <span class="bg-primary text-white px-2 h-100 d-flex align-items-center">
                    {{ tag.name }}
                  </span>
                  <span class="bg-secondary text-white px-2 h-100 d-flex align-items-center">
                    {{ tag.count }}
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
  import { getTags } from '@/utils/dbService';
  
  export default {
    components: {
      Header,
      Footer
    },
    data() {
      return {
        tags: [] // 标签列表
      };
    },
    computed: {
      sortedTags() {
        // 按数量降序排序
        return this.tags.sort((a, b) => b.count - a.count);
      }
    },
    async created() {
      await this.fetchTags();
    },
    methods: {
      async fetchTags() {
        try {
          const response = await getTags();
  
          if (response && response.tags) {
            this.tags = Object.keys(response.tags).map(tagName => ({
              name: tagName,
              count: response.tags[tagName]
            }));
          } else {
            console.error('未找到标签数据');
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      }
    }
  };
  </script>