// https://nuxt.com/docs/api/configuration/nuxt-config
import {resolve} from "path";

export default defineNuxtConfig({
    head: {
        title: "Easy Weather",
        htmlAttrs: {
            lang: "pt-br"
        },
        meta: [
            {charset: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1"},
            {hid: "description", name: "description", content: ""},
            {name: "format-detection", content: "telephone=no"}
        ],
        link: [
            {rel: "icon", type: "image/x-icon", href: "/favicon.ico"},
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap",
            }
        ]
    },

    buildModules: [
        "@nuxtjs/eslint-module",
        '@nuxtjs/fontawesome'
    ],
    fontawesome: {
        component: 'fa',
        icons: {
            solid: true,
            brands: true
        }
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {}
                }
            }
        }
    },
    css: [
        "~/assets/css/tailwind.css",
        '@fortawesome/fontawesome-svg-core/styles.css'
    ],
    alias: {
        "@": resolve(__dirname, "/")
    },
    devtools: {enabled: true},
    modules: [
        // ...
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt"
    ],
});
