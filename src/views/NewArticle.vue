<script setup>

import {
  ref,
  nextTick
} from 'vue'

import {
  useRouter
} from 'vue-router'


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


const editor = ref(null)


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
// Нийтлэл нийтлэх
// =========================

async function publishArticle() {

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
      Date.now(),

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
    // Сонгосон фонт
    // =========================

    font:
      selectedFont.value,

    status:
      'published',

    date:
      new Date()
        .toLocaleDateString(
          'mn-MN'
        )

  }


  try {

    const response =
      await fetch(
        'https://anirgui-github-io.vercel.app/api/articles',
        {
          method: 'POST',

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
        'Нийтлэл нийтлэхэд алдаа гарлаа'
      )

    }


    alert(
      'Нийтлэл амжилттай нийтлэгдлээ! 🎉'
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
// Editor эхлүүлэх
// =========================

async function initializeEditor() {

  await nextTick()

  if (editor.value) {

    editor.value.innerText =
      ''

  }

}


// =========================
// Эхлэх
// =========================

initializeEditor()

</script>


<template>

  <div class="new-page">


    <!-- TOPBAR -->

    <div class="topbar">

      <h1>
        Шинэ нийтлэл
      </h1>


      <div class="actions">

        <button
          class="cancel-button"
          @click="
            router.push('/admin')
          "
        >
          Болих
        </button>


        <button
          class="publish-button"
          @click="publishArticle"
        >
          Нийтлэх
        </button>

      </div>

    </div>


    <!-- FORM -->

    <div class="form">


      <!-- TITLE -->

      <input
        v-model="title"
        class="title-input"
        type="text"
        placeholder="Гарчиг"
      />


      <!-- AUTHOR / CATEGORY / FONT -->

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


        <!-- FONT -->

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


      <!-- EDITOR -->

      <div
        ref="editor"
        class="mongol-editor"
        contenteditable="true"
        spellcheck="false"
        data-placeholder="Монгол бичгийн текстээ энд оруулна уу..."
        :style="{
          fontFamily:
            `${selectedFont}, serif`
        }"
        @input="updateContent"
      ></div>


    </div>

  </div>

</template>


<style scoped>


/* =========================
   ФОНТУУД
========================= */

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

.new-page {

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


.publish-button {

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
   EDITOR
========================= */

.mongol-editor {

  writing-mode:
    vertical-lr;

  direction:
    ltr;

  text-orientation:
    mixed;


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


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {

  .new-page {

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