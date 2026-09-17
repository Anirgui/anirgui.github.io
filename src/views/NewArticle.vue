<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const author = ref('')
const category = ref('Өгүүллэг')
const content = ref('')

const editor = ref(null)

function updateContent() {
  if (editor.value) {
    content.value = editor.value.innerText
  }
}

async function publishArticle() {
  updateContent()

  if (!title.value.trim()) {
    alert('Гарчиг оруулна уу!')
    return
  }

  if (!content.value.trim()) {
    alert('Монгол бичгийн текстээ оруулна уу!')
    return
  }

  const article = {
    id: Date.now(),
    title: title.value.trim(),
    author: author.value.trim() || 'Тодорхойгүй',
    category: category.value,
    content: content.value,
    status: 'published',
    date: new Date().toLocaleDateString('mn-MN')
  }

  const token = localStorage.getItem('adminToken')

  if (!token) {
    alert('Нэвтрэх шаардлагатай!')
    return
  }

  try {
    const response = await fetch(
      'https://anirgui-github-io.vercel.app/api/articles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(article)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Нийтлэл хадгалахад алдаа гарлаа'
      )
    }

    alert('Нийтлэл backend рүү амжилттай илгээгдлээ! 🎉')

    router.push('/admin')
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
</script>

<template>
  <div class="page">
    <aside class="sidebar">
      <h2>Уншлагын танхим</h2>

      <router-link to="/admin">
        📚 Нийтлэлүүд
      </router-link>

      <router-link to="/admin/new">
        ✏️ Шинэ нийтлэл
      </router-link>
    </aside>

    <main class="content">
      <div class="topbar">
        <h1>Шинэ нийтлэл</h1>

        <button
          class="publish"
          @click="publishArticle"
        >
          Publish
        </button>
      </div>

      <input
        v-model="title"
        class="title"
        type="text"
        placeholder="Гарчиг оруулах"
      />

      <div class="editor">
        <div
          ref="editor"
          class="mongol-editor"
          contenteditable="true"
          spellcheck="false"
          data-placeholder="Монгол бичгийн текстээ энд оруулна уу..."
          @input="updateContent"
        ></div>
      </div>

      <div class="settings">
        <h3>Нийтлэлийн мэдээлэл</h3>

        <label>Зохиогч</label>

        <input
          v-model="author"
          type="text"
          placeholder="Зохиогчийн нэр"
        />

        <label>Ангилал</label>

        <select v-model="category">
          <option>Өгүүллэг</option>
          <option>Шүлэг</option>
          <option>Үлгэр</option>
        </select>
      </div>
    </main>
  </div>
</template>

<style scoped>
@font-face {
  font-family: MongolianScript;
  src: url('/fonts/MongolianScript.ttf');
}

* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  display: flex;
  background: #f5f5f5;
}

.sidebar {
  width: 230px;
  background: #202124;
  color: white;
  padding: 25px 15px;
}

.sidebar h2 {
  font-size: 18px;
  margin-bottom: 30px;
}

.sidebar a {
  display: block;
  color: white;
  text-decoration: none;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 5px;
}

.sidebar a:hover {
  background: #333;
}

.content {
  flex: 1;
  max-width: 1100px;
  margin: auto;
  padding: 30px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.publish {
  background: #2271b1;
  color: white;
  border: 0;
  border-radius: 5px;
  padding: 11px 22px;
  font-size: 15px;
  cursor: pointer;
}

.title {
  width: 100%;
  padding: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 28px;
  margin-bottom: 15px;
}

.editor {
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
}

.mongol-editor {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-family: MongolianScript, serif;
  font-size: 30px;
  line-height: 1.7;
  height: 500px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: pre-wrap;
  outline: none;
  padding: 20px;
}

.mongol-editor:empty::before {
  content: attr(data-placeholder);
  opacity: .4;
}

.settings {
  background: white;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.settings label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
}

.settings input,
.settings select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>