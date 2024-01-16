<script lang="ts" setup>
const $loading = useLoading()

useSeoMeta({
  title: 'My Experiences',
})

const exps = ref<{
  title: string
  description: string
  company: string
  date: string
  tasks: {
    text: string
    header?: string
    footer?: string
  }[]
}[]>([])

// fetch
const fetch = async () => {
  $loading.setLoading(true)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  try {
    const url = `${window.location.href}.json`
    const data = await $fetch(url)
    if (data && Array.isArray(data) && data.length > 0 && data[0].title) {
      exps.value = data
      console.log('exps', exps.value)
    }
  } catch (error) {
    console.log('cannot fetch exps')
  }
  $loading.setLoading(false)
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <section class="flex-1 flex flex-col justify-center page-section page-section-experience">
    <div class="flex-1 flex flex-col w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10 flex flex-col justify-center">
      <div class="page-section-header mb-4 text-custom-1">
        <span>03.</span>
        <span>My Experience</span>
      </div>
      <div class="px-4 pr-6 flex flex-col">
        <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2 min-h-[400px]">
          <ClientOnly>
            <HeadlessTabGroup :vertical="true">
              <HeadlessTabList class="w-full lg:w-1/4 flex flex-col justify-start items-start">
                <HeadlessTab v-for="(item, i) in exps" :key="i" #="{ selected }">
                  <button
                    :class="{
                      'border-l-4 transition-all duration-300 pl-4 py-2': true,
                      'border-primary-500': selected,
                      'border-slate-600': !selected
                    }"
                  >
                    {{ item.title }}
                  </button>
                </HeadlessTab>
              </HeadlessTabList>
              <HeadlessTabPanels class="flex-1">
                <HeadlessTabPanel v-for="(item, i) in exps" :key="i">
                  <div class="tab-custom-pane-header mb-4">
                    <div class="text-blue-200">
                      {{ item.description }} <span class="text-primary-500">{{ item.company }}</span>
                    </div>
                    <div class="text-sm text-slate-400 font-mono">
                      {{ item.date }}
                    </div>
                  </div>
                  <div>
                    <ul class="list-custom">
                      <li v-for="(task, j) in item.tasks" :key="j">
                        <div v-if="task?.header" class="font-bold text-primary-400 font-mono">{{ task.header }}</div>
                        <div>{{ task.text }}</div>
                        <div v-if="task?.footer" class="fw-lighter text-sm text-custom-1">
                          {{ task.footer }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </HeadlessTabPanel>
              </HeadlessTabPanels>
            </HeadlessTabGroup>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
ul.list-custom {
  list-style: none;
  padding-left: 0;
  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    &:before {
      content: '⤀';
      position: absolute;
      left: 0;
      color: theme('colors.primary.500');
    }
  }
}
</style>
