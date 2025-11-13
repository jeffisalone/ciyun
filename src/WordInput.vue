<template>
  <div class="word-input-container" style="width: 45%;margin: 0 auto;background-color: #0a0a0a;position: absolute;bottom: 20px;left: 50%;transform: translateX(-50%);">
    <input 
      v-model="newWord" 
      @keyup.enter="handleSubmit" 
      style="color: white;background-color: gray;border: 1px solid darkgray;"
    >
    <button @click="handleSubmit">添加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newWord: ''
    }
  },
  methods: {
    async handleSubmit() {
      if (this.newWord.trim()) {
        const word = this.newWord.trim()
        
        try {
          // 先向API发送POST请求
          console.log('正在发送POST请求:', { word })
          const response = await fetch('https://api.jeffisalone.site/ciyun', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
          })
          
          if (response.ok) {
            console.log('POST请求发送成功')
            // 请求成功后再更新UI并刷新数据
            this.$emit('add-word', word)
          } else {
            console.log('POST请求响应状态码:', response.status)
            // 即使状态码不是200，也更新本地UI
            this.$emit('add-word', word)
          }
        } catch (error) {
          console.log('POST请求失败:', error.message)
          // 网络错误时也更新本地UI
          this.$emit('add-word', word)
        }
        
        // 清空输入框
        this.newWord = ''
      }
    }
  }
}
</script>

<style scoped>
.word-input-container {
  padding: 20px;
  background-color: #f5f5f5;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #ddd;
}
</style>