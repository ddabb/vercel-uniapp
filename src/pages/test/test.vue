<template>
  <view>
    <!-- 保留原有跨站请求部分 -->
    <button @click="fetchData">获取跨站消息</button>

    <!-- 增强数据库操作显示 -->
    <button @click="fetchDbData">测试完整DB流程</button>

    <view class="result-container">
      <text class="section-title">数据库操作结果：</text>
      <view v-for="(op, name) in dbOperations" :key="name" class="operation-item">
        <text :class="['operation-name', op.status === '成功' ? 'success' : 'error']">
          {{ name.toUpperCase() }}:
        </text>
        <text class="operation-status">{{ op.status }}</text>
        <text v-if="op.error" class="error-message">错误: {{ op.error }}</text>
        <pre v-if="op.data" class="operation-data">{{ JSON.stringify(op.data, null, 2) }}</pre>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { insertData, selectData, updateData, deleteData } from '@/utils/dbService';
const message = ref('');
// 添加加载状态
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    // 直接使用 api/hello
    const apiUrl = '/api/hello';
    console.log('url:', apiUrl);
    // 使用 fetch 替代 axios
    const response = await fetch(apiUrl);
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    message.value = data.message;
  } catch (error) {
    console.error('请求出错:', error);
  } finally {
    loading.value = false;
  }
};

// 新增数据库操作状态对象
const dbOperations = ref({
  insert: { status: '未开始', data: null },
  select: { status: '未开始', data: null },
  update: { status: '未开始', data: null },
  delete: { status: '未开始', data: null }
});

// 重构后的数据库测试方法
const testAllDbOperations = async () => {
  loading.value = true;
  try {
    // 顺序执行所有数据库操作
    const insertRes = await insertData();
    dbOperations.value.insert = {
      status: insertRes.success ? '成功' : '失败',
      data: insertRes.data,
      error: insertRes.msg
    };

    const updateRes = await updateData();
    dbOperations.value.update = {
      status: updateRes.success ? '成功' : '失败', 
      data: updateRes.data,
      error: updateRes.msg
    };

    const selectRes = await selectData();
    dbOperations.value.select = {
      status: selectRes.success ? '成功' : '失败',
      data: selectRes.data,
      error: selectRes.msg
    };

    const deleteRes = await deleteData();
    dbOperations.value.delete = {
      status: deleteRes.success ? '成功' : '失败',
      data: deleteRes.data,
      error: deleteRes.msg
    };

  } catch (error) {
    console.error('数据库操作异常:', error);
  } finally {
    loading.value = false;
  }
};

// 修改按钮点击事件
const fetchDbData = async () => {
  await testAllDbOperations();
};
</script>



<style scoped>
/* 新增样式 */
.result-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.operation-item {
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.operation-name {
  font-weight: 500;
  margin-right: 8px;
}

.success {
  color: #67c23a;
}

.error {
  color: #f56c6c;
}

.error-message {
  color: #f56c6c;
  margin-left: 10px;
}

.operation-data {
  display: block;
  margin-top: 5px;
  padding: 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>

onMounted(async () => {
  await fetchData(); 
  await fetchDbData();
});