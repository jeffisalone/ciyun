<template>
  <div class="word-cloud-container">
    <div class="sphere-container" ref="sphereContainer">
      <div class="word-sphere" ref="wordSphere">
        <div 
          v-for="(word, index) in positionedWords" 
          :key="index"
          class="word-item"
          :style="getWordStyle(word)"
          @mouseenter="handleWordHover(word, true)"
          @mouseleave="handleWordHover(word, false)"
          @click="handleWordClick(word)"
        >
          {{ word.word }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  data() {
    return {
      words: [],
      positionedWords: [],
      radius: 200,
      rotationX: 0,
      rotationY: 0,
      isRotating: true,
      rotationInterval: null,
      // 鼠标交互相关
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    }
  },
  mounted() {
    this.fetchWordData()
    this.startAutoRotation()
    this.setupMouseEvents()
    window.addEventListener('resize', this.handleResize)
    // 移除定时刷新，只在添加新词后刷新
  },
  beforeUnmount() {
    this.stopAutoRotation()
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchWordData() {
      try {
        // 恢复使用之前工作的API地址
        const response = await fetch('https://api.jeffisalone.site/ciyun')
        const data = await response.json()
        // 确保每个词都有value值，如果没有则默认为1
        this.words = data.map(word => ({
          ...word,
          value: word.value || 1
        }))
        console.log('获取到的词云数据:', this.words)
        this.positionWordsOnSphere()
      } catch (error) {
        console.log('获取数据失败:', error.message)
        // 如果是第一次加载就失败，使用默认数据
        if (!this.words || this.words.length === 0) {
          this.words = [
            {"word": "Vue", "value": 15},
            {"word": "词云", "value": 12},
            {"word": "JavaScript", "value": 10},
            {"word": "D3.js", "value": 8},
            {"word": "前端", "value": 11}
          ]
          this.positionWordsOnSphere()
        }
      }
    },
    // 在球面上均匀分布词语
    positionWordsOnSphere() {
      // 使用斐波那契点分布算法在球面上均匀分布点
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const words = this.words.map((word, i) => {
        const y = 1 - (i / (this.words.length - 1)) * 2 // y从1到-1
        const radius = Math.sqrt(1 - y * y) // 半径在单位球上
        const theta = 2 * Math.PI * i / goldenRatio // 角度
        
        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius
        
        // 添加随机微调以避免完全规则排列
        const jitter = 0.1
        const jx = x + (Math.random() - 0.5) * jitter
        const jy = y + (Math.random() - 0.5) * jitter
        const jz = z + (Math.random() - 0.5) * jitter
        
        // 归一化以保持在球面上
        const len = Math.sqrt(jx * jx + jy * jy + jz * jz)
        
        return {
          ...word,
          x: (jx / len) * this.radius,
          y: (jy / len) * this.radius,
          z: (jz / len) * this.radius,
          color: d3.interpolateRainbow(i / this.words.length),
          scale: 1,
          isHovered: false
        }
      })
      
      this.positionedWords = words
    },
    // 获取词语的样式
    getWordStyle(word) {
      // 根据z轴位置调整大小和透明度，实现3D效果
      const baseSize = Math.max(12, Math.min(36, word.value * 2))
      const scale = word.scale
      const opacity = d3.scaleLinear()
        .domain([-this.radius, 0, this.radius])
        .range([0.3, 0.8, 1])(word.z)
      
      // 添加反向旋转，使文字始终面向观察者
      return {
        transform: `translate3d(${word.x}px, ${word.y}px, ${word.z}px) rotateX(${this.rotationX}deg) rotateY(${-this.rotationY}deg)`,
        fontSize: `${baseSize * scale}px`,
        color: word.color,
        opacity: opacity,
        zIndex: Math.floor((word.z + this.radius) * 10)
      }
    },
    // 处理词语悬停
    handleWordHover(word, isHovered) {
      const index = this.positionedWords.findIndex(w => w.word === word.word)
      if (index !== -1) {
        this.positionedWords[index].isHovered = isHovered
        this.positionedWords[index].scale = isHovered ? 1.5 : 1
        
        // 如果悬停，暂停自动旋转
        if (isHovered) {
          this.stopAutoRotation()
        } else if (this.isRotating) {
          this.startAutoRotation()
        }
      }
    },
    // 处理词语点击
    handleWordClick(word) {
      console.log('Clicked word:', word)
      // 可以添加点击效果，如弹窗、放大等
    },
    // 设置鼠标交互事件
    setupMouseEvents() {
      const sphere = this.$refs.wordSphere
      if (!sphere) return
      
      sphere.addEventListener('mousedown', (e) => {
        this.isDragging = true
        this.lastMouseX = e.clientX
        this.lastMouseY = e.clientY
        this.stopAutoRotation()
      })
      
      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return
        
        const deltaX = e.clientX - this.lastMouseX
        const deltaY = e.clientY - this.lastMouseY
        
        this.rotationY += deltaX * 0.5
        this.rotationX += deltaY * 0.5
        
        this.updateRotation()
        
        this.lastMouseX = e.clientX
        this.lastMouseY = e.clientY
      })
      
      document.addEventListener('mouseup', () => {
        this.isDragging = false
      })
      
      // 添加触摸支持
      sphere.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true
          this.lastMouseX = e.touches[0].clientX
          this.lastMouseY = e.touches[0].clientY
          this.stopAutoRotation()
        }
      })
      
      document.addEventListener('touchmove', (e) => {
        if (!this.isDragging || e.touches.length !== 1) return
        
        const deltaX = e.touches[0].clientX - this.lastMouseX
        const deltaY = e.touches[0].clientY - this.lastMouseY
        
        this.rotationY += deltaX * 0.5
        this.rotationX += deltaY * 0.5
        
        this.updateRotation()
        
        this.lastMouseX = e.touches[0].clientX
        this.lastMouseY = e.touches[0].clientY
      })
      
      document.addEventListener('touchend', () => {
        this.isDragging = false
      })
    },
    // 更新旋转状态
    updateRotation() {
      const sphere = this.$refs.wordSphere
      if (!sphere) return
      
      sphere.style.transform = `rotateX(${-this.rotationX}deg) rotateY(${this.rotationY}deg)`
    },
    // 开始自动旋转
    startAutoRotation() {
      if (this.rotationInterval) return
      
      this.rotationInterval = setInterval(() => {
        this.rotationY += 0.5
        this.updateRotation()
      }, 50)
    },
    // 停止自动旋转
    stopAutoRotation() {
      if (this.rotationInterval) {
        clearInterval(this.rotationInterval)
        this.rotationInterval = null
      }
    },
    // 切换旋转状态
    toggleRotation() {
      this.isRotating = !this.isRotating
      
      if (this.isRotating) {
        this.startAutoRotation()
      } else {
        this.stopAutoRotation()
      }
    },
    // 重置视角
    resetView() {
      this.rotationX = 0
      this.rotationY = 0
      this.updateRotation()
    },
    // 处理窗口大小变化
    handleResize() {
      // 根据容器大小调整半径
      const container = this.$refs.sphereContainer
      if (container) {
        const size = Math.min(container.clientWidth, container.clientHeight)
        this.radius = size * 0.4 // 调整为容器大小的40%
        this.positionWordsOnSphere()
      }
    },
    // 添加新词语
    addWord(newWord) {
      // 首先更新本地UI，提供即时反馈
      const existingIndex = this.words.findIndex(w => w.word === newWord)
      if (existingIndex >= 0) {
        // 如果已存在，增加其权重
        this.words[existingIndex].value += 1
      } else {
        // 否则添加新词，确保有value值
        this.words.push({ word: newWord, value: 1 })
      }
      // 立即重新布局，用户可以看到更新
      this.positionWordsOnSphere()
      
      // 延迟刷新数据，给后端一点处理时间，然后从API获取最新数据
      // 这样可以确保词云显示的是后端处理后的数据
      setTimeout(() => {
        console.log('点击按钮后刷新数据，从API获取最新词云')
        this.fetchWordData()
      }, 500) // 缩短刷新时间，更快看到效果
    }
  }
}
</script>

<style scoped>
.word-cloud-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  perspective: 1000px; /* 3D透视效果 */
  background-color: #0a0a0a;
  overflow: hidden;
}

.sphere-container {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.word-sphere {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out; /* 平滑旋转 */
  cursor: grab;
}

.word-sphere:active {
  cursor: grabbing;
}

.word-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  user-select: none;
  transition: all 0.3s ease;
  backface-visibility: hidden;
  pointer-events: auto;
}

.word-item:hover {
  filter: brightness(1.3) contrast(1.2);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.controls {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 10px;
  z-index: 100;
}

button {
  padding: 10px 20px;
  background-color: rgba(66, 185, 131, 0.8);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

button:hover {
  background-color: rgba(66, 185, 131, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

button:active {
  transform: translateY(0);
}
</style>