<script setup>
import { ref, computed, onMounted } from 'vue'

const articles = ref([])
const search = ref('')
const selectedCategory = ref('Бүгд')

const categories = ['Бүгд', 'Өгүүллэг', 'Шүлэг', 'Үлгэр']

async function loadArticles() {
  try {
    const response = await fetch(
      'https://anirgui-github-io.vercel.app/api/articles',
      {
        method: 'GET'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Нийтлэлүүдийг уншихад алдаа гарлаа'
      )
    }

    articles.value = data.articles

  } catch (error) {
    console.error(
      'Нийтлэл уншихад алдаа гарлаа:',
      error
    )

    articles.value = []
  }
}

const filteredArticles = computed(() => {
  return articles.value.filter(article => {

    const categoryMatch =
      selectedCategory.value === 'Бүгд' ||
      article.category === selectedCategory.value

    const searchMatch =
      article.title
        .toLowerCase()
        .includes(search.value.toLowerCase())

    return categoryMatch && searchMatch
  })
})

onMounted(() => {
  loadArticles()
})
</script>

<template>

  <div class="site">

    <!-- HEADER -->

    <header>

      <div>
        <h2>Anirgui Anir</h2>
        <span>Уншлагын танхим</span>
      </div>

    </header>


    <!-- HERO -->

    <section class="hero">

      <h1>
        Уншлагын танхим
      </h1>

      <p>
        Монгол бичгээр бичигдсэн зохиол бүтээлүүд
      </p>

    </section>


    <!-- SEARCH -->

    <div class="search">

      <input
        v-model="search"
        type="text"
        placeholder="🔍 Нийтлэл хайх..."
      />

    </div>


    <!-- CATEGORY -->

    <div class="categories">

      <button
        v-for="item in categories"
        :key="item"
        :class="{
          active: selectedCategory === item
        }"
        @click="selectedCategory = item"
      >
        {{ item }}
      </button>

    </div>


    <!-- ARTICLES -->

    <main class="articles">

      <article
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
      >

        <div class="article-info">

          <span class="category">
            {{ article.category }}
          </span>

          <h2>
            {{ article.title }}
          </h2>

          <p>
            {{ article.author }}
          </p>

          <small>
            {{ article.date }}
          </small>

        </div>


        <router-link
          :to="`/article/${article.id}`"
          class="read-button"
        >
          Унших →
        </router-link>

      </article>


      <!-- EMPTY -->

      <div
        v-if="filteredArticles.length === 0"
        class="empty"
      >

        <h2>
          Одоогоор нийтлэл алга байна.
        </h2>

        <p>
          Удахгүй шинэ нийтлэлүүд нэмэгдэнэ.
        </p>

      </div>

    </main>


    <!-- FOOTER -->

    <footer>
      © 2026 Anirgui Anir
    </footer>

  </div>

</template>


<style scoped>

* {
  box-sizing: border-box;
}

.site {
  min-height: 100vh;
}


/* HEADER */

header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 20px 30px;

  border-bottom: 1px solid #ddd;
}

header h2 {
  margin: 0;
}

header span {
  font-size: 13px;
  opacity: .6;
}

.admin-link {
  color: #2271b1;
  text-decoration: none;
}


/* HERO */

.hero {
  text-align: center;

  padding: 60px 20px 40px;
}

.hero h1 {
  font-size: 42px;

  margin-bottom: 10px;
}


/* SEARCH */

.search {
  max-width: 700px;

  margin: auto;

  padding: 0 20px;
}

.search input {
  width: 100%;

  padding: 14px;

  font-size: 16px;

  border: 1px solid #ccc;

  border-radius: 8px;
}


/* CATEGORY */

.categories {
  display: flex;

  justify-content: center;

  gap: 10px;

  flex-wrap: wrap;

  margin: 25px 0;
}

.categories button {
  padding: 9px 17px;

  border: 1px solid #ccc;

  border-radius: 20px;

  background: white;

  cursor: pointer;
}

.categories button.active {
  background: #222;

  color: white;
}


/* ARTICLES */

.articles {
  max-width: 1000px;

  margin: auto;

  padding: 20px;

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));

  gap: 20px;
}


.article-card {
  border: 1px solid #ddd;

  border-radius: 12px;

  padding: 25px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  min-height: 190px;
}


.category {
  font-size: 13px;

  opacity: .6;
}


.article-card h2 {
  margin: 10px 0;
}


.article-card p {
  margin: 0 0 5px;
}


.article-card small {
  opacity: .5;
}


/* READ */

.read-button {
  display: inline-block;

  margin-top: 20px;

  color: #2271b1;

  text-decoration: none;

  font-weight: bold;
}


/* EMPTY */

.empty {
  grid-column: 1 / -1;

  text-align: center;

  padding: 60px;

  opacity: .6;
}


/* FOOTER */

footer {
  text-align: center;

  padding: 50px;

  margin-top: 50px;

  opacity: .5;
}

</style>