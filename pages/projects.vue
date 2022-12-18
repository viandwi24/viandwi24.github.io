<script lang="ts" setup>
interface Project {
  name: string
  type: string
  description: string
  tags: string[]
  image: string
  links: {
    github: string
    demo: string
  }
}

const projects = ref<Project[]>([])
const isLoading = ref(true)

// fetch
const fetch = async () => {
  isLoading.value = true
  try {
    const url = `${window.location.href}.json`
    const data = await $fetch(url)
    if (data && Array.isArray(data) && data.length > 0 && data[0].name) {
      projects.value = data
      console.log(projects.value)
    }
  } catch (error) {
    console.log('cannot fetch projects')
  }
  isLoading.value = false
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <section class="page-section page-section-experience">
    <div class="container py-4 px-4 mx-auto md:w-50 mb-4">
      <div class="page-section-header mb-4 text-custom-1">
        <span>04.</span>
        <span>My Projects</span>
      </div>
      <div class="d-flex flex-column space-y-4">
        <div v-if="isLoading" class="text-center">
          Loading, Please wait...
        </div>
        <template  v-else v-for="(item, i) in projects" :key="Math.random()">
          <!-- project::left -->
          <div v-if="i % 2 === 0" class="project-item position-relative d-block mb-4 pb-4">
            <div class="col-6 position-absolute right-0" style="top: 50%; transform: translateY(-50%);">
              <img :src="item.image" alt="Preview" class="img-fluid img-muted-hover-active">
            </div>
            <div class="project-item-description left p-4 mb-4 pb-4">
              <div class="text-primary font-mono fw-lighter mb-1">{{ item.type }}</div>
              <div class="fw-bolder fs-4 mb-2">{{ item.name }}</div>
              <div class="card shadow-lg bg-dark mb-2 md:w-60">
                <div class="p-4">
                  {{ item.description }}
                </div>
              </div>
              <div class="d-flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30">
                <span v-for="tag in item.tags" :key="Math.random()">{{ tag }}</span>
              </div>
              <div class="d-flex space-x-4">
                <a class="icon-link" target="_blank" :href="item.links.github">
                  <i class="bi-github" role="img" aria-label="GitHub"></i>
                </a>
                <a class="icon-link" target="_blank" :href="item.links.demo">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
          <!-- project::right -->
          <div v-else class="project-item position-relative d-block mb-4 pb-4">
            <div class="col-6 position-absolute left-0" style="top: 50%; transform: translateY(-50%);">
              <img :src="item.image" alt="Preview" class="img-fluid img-muted-hover-active">
            </div>
            <div class="project-item-description right mb-4 pb-4 p-4 w-100 text-end d-flex flex-column justify-content-end align-items-end">
              <div class="text-primary font-mono fw-lighter mb-1">{{ item.type }}</div>
              <div class="fw-bolder fs-4 mb-2">{{ item.name }}</div>
              <div class="card shadow-lg bg-dark mb-2 md:w-60">
                <div class="p-4">
                  {{ item.description }}
                </div>
              </div>
              <div class="d-flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono">
                <span v-for="tag in item.tags" :key="Math.random()">{{ tag }}</span>
              </div>
              <div class="d-flex space-x-4">
                <a class="icon-link" target="_blank" :href="item.links.github">
                  <i class="bi-github" role="img" aria-label="GitHub"></i>
                </a>
                <a class="icon-link" target="_blank" :href="item.links.demo">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
