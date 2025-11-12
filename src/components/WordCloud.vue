<template>
  123
  <div class="word-cloud-container">
    <wordcloud
      :words="wordList"
      :options="wordCloudOptions"
      @click="handleWordClick"
      class="word-cloud"
    />
    <!-- 控制按钮 -->
    <div class="controls">
      <button @click="updateWords">更新词云</button>
      <button @click="toggleRotation">切换旋转</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import WordCloud from 'vue-wordcloud';

// 词云数据（格式：[{ text: '词语', value: 权重, color: '颜色' }, ...]）
const wordList = ref([
  { text: 'Vue', value: 100, color: '#42b983' },
  { text: 'JavaScript', value: 80, color: '#3498db' },
  { text: 'TypeScript', value: 70, color: '#9b59b6' },
  { text: 'React', value: 60, color: '#e74c3c' },
  { text: 'Node.js', value: 50, color: '#f39c12' },
  { text: 'HTML5', value: 45, color: '#1abc9c' },
  { text: 'CSS3', value: 40, color: '#2ecc71' },
  { text: 'Webpack', value: 35, color: '#e67e22' },
  { text: 'Vite', value: 30, color: '#34495e' },
  { text: 'Pinia', value: 25, color: '#27ae60' },
]);

// 词云配置项
const wordCloudOptions = reactive({
  // 尺寸
  width: '100%',
  height: 400,
  // 颜色配置（优先级：word.color > colorFunction > color）
  color: '#666', // 默认颜色
  colorFunction: (word) => word.color || `hsl(${Math.random() * 360}, 70%, 60%)`, // 动态颜色
  // 字体
  fontFamily: 'Arial, sans-serif',
  fontSize: (word) => Math.sqrt(word.value) * 5, // 字体大小随权重变化
  // 旋转
  rotate: true, // 是否允许旋转
  rotationAngles: [0, 90], // 旋转角度（0° 或 90°）
  // 布局
  padding: 5, // 词语间距
  spiral: 'rectangular', // 螺旋布局（rectangular/archimedean）
  // 交互
  tooltip: true, // 显示 tooltip
  tooltipFormatter: (word) => `${word.text}: ${word.value}`, // tooltip 格式
});

// 词语点击事件
const handleWordClick = (word) => {
  console.log('点击词语：', word.text, '权重：', word.value);
  // 可添加跳转、弹窗等交互逻辑
};

// 更新词云数据（模拟动态变化）
const updateWords = () => {
  // 随机修改部分词语的权重
  wordList.value = wordList.value.map(word => ({
    ...word,
    value: Math.floor(Math.random() * 80) + 20, // 权重 20-100
  }));
};

// 切换旋转功能
const toggleRotation = () => {
  wordCloudOptions.rotate = !wordCloudOptions.rotate;
};
</script>

<style scoped>
.word-cloud-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.word-cloud {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #36a47e;
}
</style>