<template>
  <header>
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav d-flex flex-row scrolling-menu">
          <li class="nav-item">
            <navigator url="/" open-type="navigate">
              <img src="@/static/logo.svg" alt="Logo" style="max-width: 24px; max-height: 24px; margin-right:1px;">
              自助工具站
            </navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/photos/photos" open-type="navigate">📷相册</navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/ideas/ideas" open-type="navigate">💡想法</navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/officialAccount/officialAccount" open-type="navigate">🗣️公众号</navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/tools/tools" open-type="navigate">🔧工具</navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/games/games" open-type="navigate">🎮游戏</navigator>
          </li>
          <li class="nav-item">
            <navigator url="/pages/poetry/poetry" open-type="navigate">📜诗词</navigator>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  mounted() {
    // 动态加载外部JS文件
    const scripts = [
      "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
      "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js",
      "src/static/js/clarity.js",
      "https://cdn.jsdelivr.net/npm/widget-qrcode@1.0.4/dist/widget-qrcode.min.js"
    ];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }
}
</script>

<style scoped>
/* 在这里添加特定于头部组件的样式 */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');
@import url('https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css');
@import url('@/static/css/style.css');
@import url('@/static/css/productcard.css');
@import url('@/static/css/article.css');
</style>