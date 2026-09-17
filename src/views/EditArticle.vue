<script setup>

import {
  ref,
  onMounted,
  nextTick
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


const route = useRoute()
const router = useRouter()


const title = ref('')
const author = ref('')
const category = ref('')
const content = ref('')


const editor = ref(null)


// Нийтлэл унших

async function loadArticle() {

  try {

    const response =
      await fetch(
        'https://anirgui-github-io.vercel.app/api/articles'
      )


    if (!response.ok) {

      throw new Error(
        'articles.json олдсонгүй'
      )

    }


    const data =
      await response.json()


    const article =
      data.articles.find(
        item =>
          item.id ===
          Number(route.params.id)
      )


    if (!article) {

      alert(
        'Нийтлэл олдсонгүй'
      )

      router.push('/admin')

      return
    }


    title.value =
      article.title

    author.value =
      article.author

    category.value =
      article.category

    content.value =
      article.content


    await nextTick()


    if (editor.value) {

      editor.value.innerText =
        article.content

    }


  } catch (error) {

    console.error(error)

    alert(
      'Нийтлэл уншихад алдаа гарлаа'
    )

    router.push('/admin')

  }

}


// Editor-ийн текст авах

function updateContent() {

  if (editor.value) {

    content.value =
      editor.value.innerText

  }

}


// Нийтлэл хадгалах

async function saveArticle() {

  updateContent()


  if (!title.value.trim()) {

    alert(
      'Гарчиг оруулна уу!'
    )

    return
  }


  if (!content.value.trim()) {

    alert(
      'Монгол бичгийн текстээ оруулна уу!'
    )

    return
  }


  const article = {

    id:
      Number(route.params.id),

    title:
      title.value.trim(),

    author:
      author.value.trim() ||
      'Тодорхойгүй',

    category:
      category.value,

    content:
      content.value

  }


  try {

    const response =
      await fetch(
        '/api/articles',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(article)
        }
      )


    if (!response.ok) {

      throw new Error(
        'Нийтлэл хадгалахад алдаа гарлаа'
      )

    }


    alert(
      'Нийтлэл хадгалагдлаа'
    )


    router.push(
      '/admin'
    )


  } catch (error) {

    console.error(error)

    alert(
      'Нийтлэл хадгалахад алдаа гарлаа!'
    )

  }

}


// Болих

function cancel() {

  router.push(
    '/admin'
  )

}


onMounted(() => {

  loadArticle()

})

</script>


<template>

  <div class="edit-page">


    <div class="topbar">

      <h1>
        Нийтлэл засах
      </h1>


      <div class="actions">

        <button
          class="cancel-button"
          @click="cancel"
        >
          Болих
        </button>


        <button
          class="save-button"
          @click="saveArticle"
        >
          Хадгалах
        </button>

      </div>

    </div>


    <div class="form">


      <input
        v-model="title"
        class="title-input"
        type="text"
        placeholder="Гарчиг"
      />


      <div class="row">


        <input
          v-model="author"
          type="text"
          placeholder="Зохиогч"
        />


        <select
          v-model="category"
        >

          <option value="">
            Ангилал сонгох
          </option>


          <option value="Шүлэг">
            Шүлэг
          </option>


          <option value="Өгүүллэг">
            Өгүүллэг
          </option>


          <option value="Зүйр цэцэн үг">
            Зүйр цэцэн үг
          </option>


          <option value="Бусад">
            Бусад
          </option>

        </select>

      </div>


      <div
        ref="editor"
        class="mongol-editor"
        contenteditable="true"
        spellcheck="false"
        data-placeholder="Монгол бичгийн текстээ энд оруулна уу..."
        @input="updateContent"
      ></div>


    </div>

  </div>

</template>


<style scoped>

.edit-page {
  min-height: 100vh;
  background: #f5f5f5;

  padding: 25px;

  box-sizing: border-box;
}


.topbar {

  max-width: 1000px;

  margin:
    0 auto 20px;

  display: flex;

  justify-content:
    space-between;

  align-items: center;

  gap: 15px;

}


.topbar h1 {
  margin: 0;
}


.actions {

  display: flex;

  gap: 8px;

}


.actions button {

  padding:
    9px 15px;

  border-radius: 6px;

  cursor: pointer;

  font-size: 14px;

}


.cancel-button {

  border:
    1px solid #ddd;

  background: white;

  color: #333;

}


.save-button {

  border: none;

  background: #222;

  color: white;

}


.form {

  max-width: 1000px;

  margin:
    0 auto;

}


.title-input {

  width: 100%;

  box-sizing: border-box;

  padding: 13px;

  margin-bottom: 12px;

  border:
    1px solid #ddd;

  border-radius: 7px;

  font-size: 20px;

  background: white;

}


.row {

  display: flex;

  gap: 10px;

  margin-bottom: 15px;

}


.row input,
.row select {

  flex: 1;

  padding: 11px;

  border:
    1px solid #ddd;

  border-radius: 7px;

  background: white;

  font-size: 15px;

}


.mongol-editor {

  writing-mode:
    vertical-lr;

  direction:
    ltr;

  text-orientation:
    mixed;


  font-family:
    MongolianScript,
    serif;

  font-size:
    18px;

  line-height:
    1.7;


  min-height:
    700px;

  width:
    100%;


  white-space:
    pre-wrap;


  text-align:
    left;


  outline:
    none;


  padding:
    25px;


  background:
    white;

  border:
    1px solid #ddd;

  border-radius:
    8px;


  overflow-x:
    auto;

  overflow-y:
    hidden;


  box-sizing:
    border-box;

}


@media (max-width: 600px) {

  .edit-page {

    padding:
      15px;

  }


  .topbar {

    align-items:
      flex-start;

    flex-direction:
      column;

  }


  .actions {

    width:
      100%;

  }


  .actions button {

    flex:
      1;

  }


  .row {

    flex-direction:
      column;

  }

}

</style>