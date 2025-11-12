<template>
  <div id="app">
    <h1>Vue 词云示例</h1>
    <WordCloud />
  </div>
</template>

<script setup>
import WordCloud from './components/WordCloud.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>