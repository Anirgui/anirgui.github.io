<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        useRoute,
        useRouter
    } from 'vue-router'

    const route = useRoute()
    const router = useRouter()

    const article = ref(null)

    // Background зураг
    const backgroundImage = ref('')

    async function loadArticle() {
        try {
            const response = await fetch('https://anirgui-github-io.vercel.app/api/articles')

            if (!response.ok) {
                throw new Error('articles.json олдсонгүй')
            }

            const data = await response.json()

            const id = Number(route.params.id)

            article.value = data.articles.find(
                item => Number(item.id) === id
            )

        } catch (error) {
            console.error('Нийтлэл уншихад алдаа гарлаа:', error)
            article.value = null
        }

        // GitHub Pages дээрх background зургийг унших
        backgroundImage.value =
        `${import.meta.env.BASE_URL}images/background.jpg`
    }

    onMounted(() => {
        loadArticle()
    })

    function goBack() {
        router.back()
    }
</script>

<template>
    <div class="reader">

        <header class="topbar">

            <button @click="goBack">
                ← Буцах
            </button>

            <router-link to="/">
                Уншлагын танхим
            </router-link>

        </header>


        <main
            v-if="article"
            class="article"
            >

            <div class="meta">

                <span>
                    {{ article.category }}
                </span>

                <span>
                    {{ article.date }}
                </span>

            </div>


            <h1>
                {{ article.title }}
            </h1>


            <p class="author">
                {{ article.author }}
            </p>


            <!-- Монгол бичгийн уншигч -->

            <div
                class="mongol-reader"
                :style=" {
                    backgroundImage: backgroundImage
                    ? `url(${backgroundImage})`
                    : 'none'
                    }"
      >

                    {{ article.content }}

                    </div>

                </main>


                <main
                    v-else
                    class="not-found"
                    >

                    <h1>
                        Нийтлэл олдсонгүй
                    </h1>

                    <p>
                        Энэ нийтлэл устсан эсвэл байхгүй байна.
                    </p>

                    <router-link to="/">
                        Нүүр хуудас руу буцах
                    </router-link>

                </main>

            </div>
        </template>


        <style>

            @font-face {
                font-family: MongolianScript;
                src: url('/fonts/MongolianScript.ttf');
            }


            * {
                box-sizing: border-box;
            }


            body {
                margin: 0;
                background: #f5f1e8;
            }


            /* =========================
   READER
========================= */

            .reader {
                min-height: 100vh;
                color: #222;
            }


            /* =========================
   TOPBAR
========================= */

            .topbar {
                height: 60px;

                display: flex;

                align-items: center;

                justify-content: space-between;

                padding: 0 25px;

                background: white;

                border-bottom: 1px solid #ddd;
            }


            .topbar button {
                border: none;

                background: none;

                font-size: 16px;

                cursor: pointer;
            }


            .topbar a {
                text-decoration: none;

                color: #222;

                font-weight: bold;
            }


            /* =========================
   ARTICLE
========================= */

            .article {
                max-width: 1100px;

                margin: 40px auto;

                padding: 0 25px;
            }


            .meta {
                display: flex;

                gap: 15px;

                color: #777;

                font-size: 14px;
            }


            .article h1 {
                margin: 15px 0 5px;

                font-size: 32px;
            }


            .author {
                color: #666;

                margin-bottom: 30px;
            }


            /* =========================
   МОНГОЛ БИЧГИЙН УНШИГЧ
========================= */

            .mongol-reader {

                writing-mode: vertical-lr;

                font-family: MongolianScript, serif;

                font-size: 18px;

                line-height: 1.7;


                /* 9:16 цонх */

                width: min(100%, 360px);

                aspect-ratio: 9 / 16;

                margin: 30px auto;


                white-space: pre-wrap;


                /* Background */

                background-color: white;

                background-size: cover;

                background-position: center;

                background-repeat: no-repeat;


                border: 1px solid #ddd;

                border-radius: 10px;


                /* Дотор зай */

                padding: 20px;


                /* Swipe */

                overflow-x: auto;

                overflow-y: hidden;

                touch-action: pan-x pan-y;

                -webkit-overflow-scrolling: touch;

            }


            /* =========================
   NOT FOUND
========================= */

            .not-found {
                text-align: center;

                padding: 100px 20px;
            }


            .not-found a {
                display: inline-block;

                margin-top: 20px;
            }

        </style>