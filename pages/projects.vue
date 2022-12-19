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
const listingMode = ref<'list' | 'grid'>('grid')

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
        <div class="fs-6 text-center text-muted fw-bold">
          Note: not all my projects are listed here. I have a lot of private projects and can't share them.
        </div>
        <div>
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm text-lg rounded d-flex justify-content-center align-items-center"
              :class="{
                'btn-primary': listingMode === 'list',
                'btn-secondary': listingMode === 'grid',
              }"
              @click="() => listingMode = 'list'"
            >
              <i class="bi bi-card-list"></i>
            </button>
            <button
              class="btn btn-sm text-lg rounded d-flex justify-content-center align-items-center"
              :class="{
                'btn-primary': listingMode === 'grid',
                'btn-secondary': listingMode === 'list',
              }"
              @click="() => listingMode = 'grid'"
            >
              <i class="bi bi-grid-3x2-gap-fill"></i>
            </button>
          </div>
        </div>
        <div v-if="isLoading" class="text-center">
          Loading, Please wait...
        </div>
        <template v-if="listingMode === 'list'">
          <template  v-if="!isLoading" v-for="(item, i) in projects" :key="Math.random()">
            <!-- project::left -->
            <div v-if="i % 2 === 0" class="project-item position-relative d-block mb-4 pb-4">
              <div class="col-6 position-absolute right-0 flex justify-end items-end w-full" style="top: 50%; transform: translateY(-50%);">
                <img :src="item.image" alt="Preview" class="img-fluid img-muted-hover-active self-end">
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
        </template>
        <template v-if="listingMode === 'grid'">
            <div class="row">
              <template  v-if="!isLoading" v-for="(item, i) in projects" :key="Math.random()">
                <div class="col-3 px-2 py-2">
                  <div
                    :style="{
                      position: 'relative',
                      height: '170px',
                      overflow: 'hidden',
                      borderRadius: '10px',
                    }"
                  >
                    <img
                      :src="item.image"
                      alt="Preview"
                      :style="{
                        position: 'absolute',
                        display: 'block',
                        width: '100%',
                        transform: 'scale(1.25) translate(-50%, -50%)',
                        left: '50%',
                        top: '50%'
                      }"
                    >
                    <!-- <div class="card-title text-truncate">{{ item.name }}</div> -->
                  </div>
                </div>
              </template>
            </div>
          </template>
      </div>
    </div>
  </section>
</template>
