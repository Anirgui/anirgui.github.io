<script setup>
import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'

const router = useRouter()

const articles = ref([])

const backgroundImage = ref('')

const fileInput = ref(null)


// Нийтлэлүүдийг унших

async function loadArticles() {

  try {

    const response = await fetch(
      './articles.json'
    )

    if (!response.ok) {
      throw new Error(
        'articles.json олдсонгүй'
      )
    }

    articles.value =
      await response.json()

  } catch (error) {

    console.error(
      'Нийтлэл уншихад алдаа гарлаа:',
      error
    )

    articles.value = []

  }

}


// Background зураг

function loadBackground() {

  backgroundImage.value =
    localStorage.getItem(
      'readerBackground'
    ) || ''

}


function chooseBackground() {

  fileInput.value.click()

}


function handleBackgroundUpload(event) {

  const file =
    event.target.files[0]

  if (!file) {
    return
  }

  if (
    !file.type.startsWith(
      'image/'
    )
  ) {

    alert(
      'Зөвхөн зураг сонгоно уу.'
    )

    return
  }


  const reader =
    new FileReader()


  reader.onload = () => {

    backgroundImage.value =
      reader.result

    localStorage.setItem(
      'readerBackground',
      reader.result
    )

  }


  reader.readAsDataURL(file)

}


// Background устгах

function removeBackground() {

  if (
    !confirm(
      'Background зургийг устгах уу?'
    )
  ) {
    return
  }


  backgroundImage.value = ''

  localStorage.removeItem(
    'readerBackground'
  )

}


// Нийтлэл устгах

async function deleteArticle(id) {

  if (
    !confirm(
      'Энэ нийтлэлийг устгах уу?'
    )
  ) {
    return
  }


  try {

    const response =
      await fetch(
        '/api/articles',
        {
          method: 'DELETE',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            id: id
          })
        }
      )


    if (!response.ok) {

      throw new Error(
        'Нийтлэл устгахад алдаа гарлаа'
      )

    }


    await loadArticles()


    alert(
      'Нийтлэл устгагдлаа.'
    )


  } catch (error) {

    console.error(error)

    alert(
      'Нийтлэл устгахад алдаа гарлаа!'
    )

  }

}


// Гарах

function logout() {

  localStorage.removeItem(
    'adminLoggedIn'
  )

  router.push(
    '/admin/login'
  )

}


onMounted(() => {

  loadArticles()

  loadBackground()

})

</script>


<template>

  <div class="admin-page">


    <!-- Зүүн талын Admin цэс -->

    <aside class="sidebar">

      <h2>
        Уншлагын танхим
      </h2>


      <router-link
        to="/admin/new"
        class="menu-link"
      >
        ✏️ Шинэ нийтлэл
      </router-link>


      <router-link
        to="/"
        class="menu-link"
      >
        🌐 Сайт харах
      </router-link>


      <!-- Background зураг -->

      <div
        class="background-section"
      >

        <div
          class="background-title"
        >
          🖼️ Background зураг
        </div>


        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleBackgroundUpload"
        />


        <button
          class="menu-link"
          @click="chooseBackground"
        >
          Зураг сонгох
        </button>


        <button
          v-if="backgroundImage"
          class="remove-background"
          @click="removeBackground"
        >
          Зураг устгах
        </button>


        <div
          v-if="backgroundImage"
          class="background-preview"
        >

          <img
            :src="backgroundImage"
            alt="Background preview"
          />

        </div>

      </div>


      <!-- Гарах -->

      <button
        class="menu-link logout"
        @click="logout"
      >
        🚪 Гарах
      </button>

    </aside>


    <!-- Үндсэн хэсэг -->

    <main class="main">

      <div class="topbar">

        <h1>
          Нийтлэлүүд
        </h1>

      </div>


      <!-- Нийтлэл байхгүй -->

      <div
        v-if="articles.length === 0"
        class="empty"
      >

        <h2>
          Одоогоор нийтлэл алга
        </h2>

        <p>
          Шинэ нийтлэл үүсгээд Publish дарна уу.
        </p>


        <router-link
          to="/admin/new"
          class="new-button"
        >
          + Шинэ нийтлэл
        </router-link>

      </div>


      <!-- Нийтлэлүүд -->

      <div
        v-else
        class="post-list"
      >

        <div
          v-for="article in articles"
          :key="article.id"
          class="post"
        >

          <div class="post-info">

            <h2>
              {{ article.title }}
            </h2>


            <div class="meta">

              <span>
                {{ article.category }}
              </span>

              <span>
                {{ article.author }}
              </span>

              <span>
                {{ article.date }}
              </span>

              <span
                class="published"
              >
                Published
              </span>

            </div>

          </div>


          <div class="actions">

            <router-link
              :to="`/admin/edit/${article.id}`"
              class="edit"
            >
              Засах
            </router-link>


            <button
              class="delete"
              @click="deleteArticle(article.id)"
            >
              Устгах
            </button>

          </div>

        </div>

      </div>

    </main>

  </div>

</template>


<style scoped>

.admin-page {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}


/* SIDEBAR */

.sidebar {
  width: 220px;
  padding: 20px;

  background: white;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  margin: 0 0 25px;
}


/* Admin цэс */

.menu-link {
  display: block;

  width: 100%;

  padding: 7px 0;

  margin: 0;

  background: none;
  border: none;

  color: #333;

  text-decoration: none;

  font-size: 14px;
  font-weight: normal;

  text-align: left;

  cursor: pointer;

  box-sizing: border-box;
}

.menu-link:hover {
  color: #000;
}


/* Background */

.background-section {
  margin-top: 15px;
  padding-top: 15px;

  border-top: 1px solid #eee;
}

.background-title {
  margin-bottom: 5px;

  font-size: 14px;
  font-weight: bold;
}

.remove-background {
  display: block;

  border: none;
  background: none;

  padding: 5px 0;

  color: #c00;

  font-size: 13px;

  cursor: pointer;
}

.background-preview {
  margin-top: 8px;

  width: 70px;
  height: 100px;

  overflow: hidden;

  border-radius: 5px;

  border: 1px solid #ddd;
}

.background-preview img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* Гарах */

.logout {
  margin-top: auto;
  color: #777;
}

.logout:hover {
  color: #c00;
}


/* MAIN */

.main {
  flex: 1;
  padding: 30px;
}


/* Гарчиг */

.topbar {
  margin-bottom: 25px;
}

.topbar h1 {
  margin: 0;
}


/* EMPTY */

.empty {
  background: white;

  padding: 40px;

  text-align: center;

  border-radius: 8px;
}

.empty p {
  color: #777;
}


/* Шинэ нийтлэл */

.new-button {
  display: inline-block;

  margin-top: 10px;

  padding: 9px 14px;

  background: #222;
  color: white;

  text-decoration: none;

  border-radius: 6px;

  font-size: 14px;
}


/* POSTS */

.post-list {
  display: flex;

  flex-direction: column;

  gap: 12px;
}

.post {
  background: white;

  padding: 20px;

  border-radius: 8px;

  display: flex;

  justify-content: space-between;

  align-items: center;
}

.post-info h2 {
  margin: 0 0 10px;
}

.meta {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  color: #777;

  font-size: 14px;
}

.published {
  color: green;
}


/* ACTIONS */

.actions {
  display: flex;

  gap: 8px;
}

.edit,
.delete {
  padding: 7px 11px;

  border-radius: 5px;

  font-size: 14px;

  text-decoration: none;

  cursor: pointer;
}

.edit {
  background: #eee;

  color: #222;
}

.delete {
  border: none;

  background: #eee;

  color: #c00;
}


/* MOBILE */

@media (max-width: 600px) {

  .admin-page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;

    flex-direction: row;

    flex-wrap: wrap;

    align-items: center;

    padding: 12px 15px;
  }

  .sidebar h2 {
    width: 100%;

    margin: 0 0 5px;
  }

  .menu-link {
    width: auto;

    padding: 5px 10px 5px 0;
  }

  .background-section {
    width: 100%;
  }

  .logout {
    margin-top: 0;
  }

  .main {
    padding: 15px;
  }

  .topbar {
    margin-bottom: 15px;
  }

  .post {
    flex-direction: column;

    align-items: stretch;

    gap: 15px;
  }

  .actions {
    justify-content: flex-end;
  }

}

</style>