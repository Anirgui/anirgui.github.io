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

// =========================
// Фонт
// =========================

const selectedFont = ref('MongolianScript')

// =========================
// Үсгийн хэмжээ
// =========================

const fontSize = ref(18)

// =========================
// Үсгийн өнгө
// =========================

const fontColor = ref('#222222')

// =========================
// Мөрийн зай
// =========================

const lineHeight = ref(1.7)


const editor = ref(null)


// =========================
// Нийтлэл унших
// =========================

async function loadArticle() {

  try {

    const response =
      await fetch(
        'https://anirgui-github-io.vercel.app/api/articles'
      )


    if (!response.ok) {

      throw new Error(
        'Нийтлэлүүдийг уншихад алдаа гарлаа'
      )

    }


    const data =
      await response.json()


    const article =
      data.articles.find(
        item =>
          Number(item.id) ===
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
      article.author || ''

    category.value =
      article.category || ''

    content.value =
      article.content


    // =========================
    // Өмнө хадгалсан фонт
    // =========================

    selectedFont.value =
      article.font ||
      'MongolianScript'


    // =========================
    // Өмнө хадгалсан хэмжээ
    // =========================

    fontSize.value =
      Number(article.font_size) || 18


    // =========================
    // Өмнө хадгалсан өнгө
    // =========================

    fontColor.value =
      article.font_color ||
      '#222222'


    // =========================
    // Өмнө хадгалсан мөрийн зай
    // =========================

    lineHeight.value =
      Number(article.line_height) || 1.7


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


// =========================
// Editor-ийн текст авах
// =========================

function updateContent() {

  if (editor.value) {

    content.value =
      editor.value.innerText

  }

}


// =========================
// Нийтлэл хадгалах
// =========================

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


  const token =
    localStorage.getItem(
      'adminToken'
    )


  if (!token) {

    alert(
      'Нэвтрэх шаардлагатай!'
    )

    router.push(
      '/admin/login'
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
      content.value,

    // =========================
    // Фонт
    // =========================

    font:
      selectedFont.value,

    // =========================
    // Үсгийн хэмжээ
    // =========================

    font_size:
      fontSize.value,

    // =========================
    // Үсгийн өнгө
    // =========================

    font_color:
      fontColor.value,

    // =========================
    // Мөрийн зай
    // =========================

    line_height:
      lineHeight.value

  }


  try {

    const response =
      await fetch(
        'https://anirgui-github-io.vercel.app/api/articles',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            'Authorization':
              `Bearer ${token}`
          },

          body:
            JSON.stringify(article)
        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.error ||
        'Нийтлэл хадгалахад алдаа гарлаа'
      )

    }


    alert(
      'Нийтлэл хадгалагдлаа! 🎉'
    )


    router.push(
      '/admin'
    )


  } catch (error) {

    console.error(error)

    alert(
      error.message
    )

  }

}


// =========================
// Болих
// =========================

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


        <!-- =========================
             Фонт
        ========================== -->

        <select
          v-model="selectedFont"
        >

          <option value="Chimee">
            Chimee
          </option>


          <option value="MonBaiti">
            Microsoft
          </option>


          <option value="MongolianScript">
            Кимо / Болорсофт
          </option>

        </select>


      </div>


      <!-- =========================
           TEXT SETTINGS
      ========================== -->

      <div class="text-settings">


        <!-- FONT SIZE -->

        <label>

          Үсгийн хэмжээ

          <input
            v-model.number="fontSize"
            type="number"
            min="8"
            max="100"
            step="1"
          />

        </label>


        <!-- FONT COLOR -->

        <label class="color-control">

          Үсгийн өнгө

          <input
            v-model="fontColor"
            type="color"
          />

        </label>


        <!-- LINE HEIGHT -->

        <label>

          Мөрийн зай

          <select
            v-model.number="lineHeight"
          >

            <option :value="1.2">
              1.2
            </option>

            <option :value="1.4">
              1.4
            </option>

            <option :value="1.5">
              1.5
            </option>

            <option :value="1.7">
              1.7
            </option>

            <option :value="2">
              2.0
            </option>

            <option :value="2.2">
              2.2
            </option>

            <option :value="2.5">
              2.5
            </option>

          </select>

        </label>


      </div>


      <!-- =========================
           EDITOR
      ========================== -->

      <div
        ref="editor"
        class="mongol-editor"
        contenteditable="true"
        spellcheck="false"
        data-placeholder="Монгол бичгийн текстээ энд оруулна уу..."
        :style="{
          fontFamily:
            `${selectedFont}, serif`,

          fontSize:
            `${fontSize}px`,

          color:
            fontColor,

          lineHeight:
            lineHeight
        }"
        @input="updateContent"
      ></div>


    </div>

  </div>

</template>


<style scoped>

@font-face {

  font-family:
    Chimee;

  src:
    url('/fonts/Chimee.ttf');

}


@font-face {

  font-family:
    MonBaiti;

  src:
    url('/fonts/monbaiti.ttf');

}


@font-face {

  font-family:
    MongolianScript;

  src:
    url('/fonts/MongolianScript.ttf');

}


/* =========================
   PAGE
========================= */

.edit-page {

  min-height:
    100vh;

  background:
    #f5f5f5;

  padding:
    25px;

  box-sizing:
    border-box;

}


/* =========================
   TOPBAR
========================= */

.topbar {

  max-width:
    1000px;

  margin:
    0 auto 20px;

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  gap:
    15px;

}


.topbar h1 {

  margin:
    0;

}


.actions {

  display:
    flex;

  gap:
    8px;

}


.actions button {

  padding:
    9px 15px;

  border-radius:
    6px;

  cursor:
    pointer;

  font-size:
    14px;

}


.cancel-button {

  border:
    1px solid #ddd;

  background:
    white;

  color:
    #333;

}


.save-button {

  border:
    none;

  background:
    #222;

  color:
    white;

}


/* =========================
   FORM
========================= */

.form {

  max-width:
    1000px;

  margin:
    0 auto;

}


.title-input {

  width:
    100%;

  box-sizing:
    border-box;

  padding:
    13px;

  margin-bottom:
    12px;

  border:
    1px solid #ddd;

  border-radius:
    7px;

  font-size:
    20px;

  background:
    white;

}


/* =========================
   ROW
========================= */

.row {

  display:
    flex;

  gap:
    10px;

  margin-bottom:
    15px;

}


.row input,
.row select {

  flex:
    1;

  padding:
    11px;

  border:
    1px solid #ddd;

  border-radius:
    7px;

  background:
    white;

  font-size:
    15px;

}


/* =========================
   TEXT SETTINGS
========================= */

.text-settings {

  display:
    flex;

  gap:
    10px;

  margin-bottom:
    15px;

}


.text-settings label {

  flex:
    1;

  display:
    flex;

  flex-direction:
    column;

  gap:
    6px;

  font-size:
    14px;

  color:
    #555;

}


.text-settings input,
.text-settings select {

  width:
    100%;

  padding:
    10px;

  border:
    1px solid #ddd;

  border-radius:
    7px;

  background:
    white;

  font-size:
    15px;

  box-sizing:
    border-box;

}


.color-control input {

  height:
    42px;

  padding:
    3px;

}


/* =========================
   EDITOR
========================= */

.mongol-editor {

  writing-mode:
    vertical-lr;

  direction:
    ltr;

  text-orientation:
    mixed;


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


/* =========================
   MOBILE
========================= */

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


  .text-settings {

    flex-direction:
      column;

  }

}

</style>