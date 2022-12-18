//@ts-ignore
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-icons/font/bootstrap-icons.scss'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('bootstrap', bootstrap)
})
