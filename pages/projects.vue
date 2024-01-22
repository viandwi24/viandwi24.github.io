<script lang="ts" setup>
const $loading = useLoading()

useSeoMeta({
  title: 'Projects',
})

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
const listingMode = ref<'list' | 'grid'>('list')

// fetch
const fetch = async () => {
  $loading.setLoading(true)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  try {
    const url = `${window.location.href}.json`
    const data = await $fetch(url)
    if (data && Array.isArray(data) && data.length > 0 && data[0].name) {
      projects.value = data
      console.log('projects', projects.value)
    }
  } catch (error) {
    console.log('cannot fetch projects')
  }
  $loading.setLoading(false)
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <section class="flex-1 flex flex-col justify-center page-section page-section-experienc">
    <div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4">
      <div class="page-section-header mb-4 text-custom-1">
        <span>04.</span>
        <span>My Projects</span>
      </div>
      <div class="flex flex-col space-y-4">
        <div class="text-center text-xs font-semibold text-gray-500">
          Note: not all my projects are listed here. I have a lot of private projects and can't share them.
        </div>
        <div>
          <div class="flex">
            <button
              class="text-lg rounded flex justify-center items-center border px-1.5 py-1"
              :class="{
                'bg-gray-500/75': listingMode === 'list',
                '': listingMode === 'grid',
              }"
              @click="() => listingMode = 'list'"
            >
              <Icon name="material-symbols:view-list-sharp" />
            </button>
            <button
              class="text-lg rounded flex justify-center items-center border px-1.5 py-1"
              :class="{
                'bg-gray-500/75': listingMode === 'grid',
                '': listingMode === 'list',
              }"
              @click="() => listingMode = 'grid'"
            >
              <Icon name="bi:grid-3x3-gap-fill" class="text-sm" />
            </button>
          </div>
        </div>
        <div v-if="$loading.$state.isLoading" class="text-center">
          Loading, Please wait...
        </div>

        <template v-if="listingMode === 'list'">
          <template  v-if="!$loading.$state.isLoading" v-for="(item, i) in projects" :key="Math.random()">
            <div v-if="i % 2 === 0" class="group pb-10">
              <div class="relative flex flex-col lg:flex-row items-center w-full h-[500px] lg:h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700">
                <div class="w-full lg:w-1/2 h-full rounded-lg relative overflow-hidden flex mb-4 lg:mb-0">
                  <img
                    v-if="item.image.split('.').pop() === 'gif'"
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }"
                  />
                  <NuxtImg
                    v-else
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }"
                  />
                </div>
                <div class="flex-1 flex flex-col justify-end items-end pl-8">
                  <div class="text-primary text-xs font-mono fw-lighter mb-1 pr-2">{{ item.type }}</div>
                  <div class="text-primary-500 text-lg mb-4 pr-2">{{ item.name }}</div>
                  <div class="pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4">{{ item.description }}</div>
                  <div class="flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30">
                    <span v-for="tag in item.tags" :key="Math.random()">{{ tag }}</span>
                  </div>
                  <div class="flex space-x-4">
                    <a v-if="item.links?.github" class="icon-link" target="_blank" :href="item.links?.github">
                      <Icon class="text-lg" name="mdi:github" role="img" aria-label="GitHub" />
                    </a>
                    <a v-if="item.links?.demo" class="icon-link" target="_blank" :href="item.links?.demo">
                      <Icon class="text-lg" name="material-symbols-light:open-in-new" />
                    </a>
                  </div>
                </div>
                <!-- <img :src="item.image" alt="Preview" class=""> -->
              </div>
            </div>
            <div v-if="i % 2 !== 0" class="group pb-10">
              <div class="relative flex flex-col-reverse lg:flex-row items-center w-full h-[500px] lg:h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700">
                <div class="flex-1 flex flex-col justify-start items-start lg:pr-8">
                  <div class="text-primary text-xs font-mono fw-lighter mb-1 pr-2">{{ item.type }}</div>
                  <div class="text-primary-500 text-lg mb-4 pr-2">{{ item.name }}</div>
                  <div class="pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4">{{ item.description }}</div>
                  <div class="flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30">
                    <span v-for="tag in item.tags" :key="Math.random()">{{ tag }}</span>
                  </div>
                  <div class="flex space-x-4">
                    <a v-if="item.links?.github" class="icon-link" target="_blank" :href="item.links?.github">
                      <Icon class="text-lg" name="mdi:github" role="img" aria-label="GitHub" />
                    </a>
                    <a v-if="item.links?.demo" class="icon-link" target="_blank" :href="item.links?.demo">
                      <Icon class="text-lg" name="material-symbols-light:open-in-new" />
                    </a>
                  </div>
                </div>
                <div class="w-full lg:w-1/2 h-full rounded-lg relative overflow-hidden flex mb-4 lg:mb-0">
                  <img
                    v-if="item.image.split('.').pop() === 'gif'"
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }"
                  />
                  <NuxtImg
                    v-else
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }"
                  />
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-if="listingMode === 'grid'">
          <div class="grid grid-cols-2 lg:grid-cols-4">
            <template  v-if="!$loading.$state.isLoading" v-for="(item, i) in projects" :key="Math.random()">
              <a class="px-2 py-2 border border-transparent hover:border-primary-600 rounded-lg transition-all duration-300" :href="item.links?.demo || undefined" target="_blank">
                <div
                  :style="{
                    position: 'relative',
                    height: '170px',
                    overflow: 'hidden',
                    borderRadius: '10px',
                  }"
                >
                  <img
                    v-if="item.image.split('.').pop() === 'gif'"
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      position: 'absolute',
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      transform: 'scale(1.25) translate(-50%, -50%)',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      left: '50%',
                      top: '50%'
                    }"
                  />
                  <NuxtImg
                    v-else
                    :src="item.image"
                    :alt="`Preview of ${item.name}`"
                    :style="{
                      position: 'absolute',
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      transform: 'scale(1.25) translate(-50%, -50%)',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      left: '50%',
                      top: '50%'
                    }"
                  />
                </div>
              </a>
            </template>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
// page::experience
.project-item {
  border: 1px solid transparent;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  .img-muted-hover-active {
    filter: grayscale(100%);
    transition: all 0.3s ease-in-out;
  }
  .project-item-description {
    transition: all 0.3s ease-in-out;
  }
  &:hover {
    border: 1px solid theme('colors.primary.500');
    padding: 10px;
    border-radius: 4px;
    .img-muted-hover-active {
      filter: grayscale(0%);
    }
    .project-item-description.right {
      // transform: translateX(50px);
    }
    .project-item-description.left {
      // transform: translateX(-50px);
      // padding-left: -100px;
    }
  }
}
</style>
