<template>
  <div class="word-cloud-app">
    <WordCloudView ref="wordCloudView" />
    <WordInput @add-word="updateWordCloud" />
  </div>
</template>

<script>
import WordCloudView from './WordCloudView.vue'
import WordInput from './WordInput.vue'

export default {
  components: {
    WordCloudView,
    WordInput
  },
  methods: {
    updateWordCloud(newWord) {
      if (this.$refs.wordCloudView) {
        this.$refs.wordCloudView.addWord(newWord)
      } else {
        console.warn('WordCloudView组件尚未初始化')
      }
    }
  }
}
</script>

<style lang="css">
.word-cloud-app {
  width: 100vw;
  max-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
</style>