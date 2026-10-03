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

const selectedFont =
  ref('MongolianScript')


// =========================
// Үсгийн хэмжээ
// =========================

const fontSize =
  ref(18)


// =========================
// Үсгийн өнгө
// =========================

const fontColor =
  ref('#222222')


// =========================
// Мөрийн зай
// =========================

const lineHeight =
  ref(1.7)


const editor =
  ref(null)


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


    selectedFont.value =
      article.font ||
      'MongolianScript'


    fontSize.value =
      Number(article.font_size) || 18


    fontColor.value =
      article.font_color ||
      '#222222'


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
// Текст өөрчлөгдөх бүрт
// =========================

function updateContent() {

  if (editor.value) {

    content.value =
      editor.value.innerText

  }

}


// =========================
// Буцаах
// =========================

function undoText() {

  if (!editor.value) {
    return
  }


  editor.value.focus()


  document.execCommand(
    'undo'
  )


  updateContent()

}


// =========================
// Хадгалах
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

    font:
      selectedFont.value,

    font_size:
      fontSize.value,

    font_color:
      fontColor.value,

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

        <!-- Буцаах -->

        <button
          class="undo-button"
          @click="undoText"
        >
          ↶ Буцаах
        </button>


        <!-- Болих -->

        <button
          class="cancel-button"
          @click="cancel"
        >
          Болих
        </button>


        <!-- Хадгалах -->

        <button
          class="save-button"
          @click="saveArticle"
        >
          Хадгалах
        </button>

      </div>

    </div>


    <div class="form">


      <!-- Гарчиг -->

      <input
        v-model="title"
        class="title-input"
        type="text"
        placeholder="Гарчиг"
      />


      <div class="row">


        <!-- Зохиогч -->

        <input
          v-model="author"
          type="text"
          placeholder="Зохиогч"
        />


        <!-- Ангилал -->

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


        <!-- Фонт -->

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


      <!-- Текстийн тохиргоо -->

      <div class="text-settings">


        <!-- Үсгийн хэмжээ -->

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


        <!-- Үсгийн өнгө -->

        <label
          class="color-control"
        >

          Үсгийн өнгө

          <input
            v-model="fontColor"
            type="color"
          />

        </label>


        <!-- Мөрийн зай -->

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


      <!-- Монгол бичгийн редактор -->

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


/* =========================
   Буцаах
   ========================= */

.undo-button {

  border:
    1px solid #ddd;

  background:
    white;

  color:
    #333;

}


/* =========================
   Болих
   ========================= */

.cancel-button {

  border:
    1px solid #ddd;

  background:
    white;

  color:
    #333;

}


/* =========================
   Хадгалах
   ========================= */

.save-button {

  border:
    none;

  background:
    #222;

  color:
    white;

}


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

Энд ↶ Буцаах нь зөвхөн редактор дотор хийсэн бичилт/устгалын үйлдлийг буцаана. Neon database-д аль хэдийн хадгалсан нийтлэлийг буцаахгүй.

Хэрэв энэ товч Android Chrome дээр ажиллахгүй байвал дараагийн алхамд "document.execCommand('undo')"-оос хамаарахгүй, өөрийн undo history хийж өгч болно.