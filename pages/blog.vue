<script lang="ts" setup>
useSeoMeta({
  title: 'Blog',
})

useLoading().setLoading(false)

const { data } = await useFetch('/api/feed')
</script>

<template>
  <section class="flex-1 flex flex-col justify-center page-section page-section-experienc">
    <div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4">
      <div class="page-section-header mb-4 text-custom-1">
        <span>05.</span>
        <span>Blog</span>
      </div>
      <div class="flex flex-col space-y-4">
        <div v-for="(type, i) in data?.data || []" :key="i">
          <div class="text-lg font-semibold">{{ type.typeName }}</div>
          <div class="flex flex-col gap-2 mt-4">
            <a
              v-for="(item, j) in type.feed.items || []" :key="j"
              class="px-4 py-2 border border-gray-500/50 rounded flex flex-row gap-4 hover:bg-gray-500/10"
              :href="item.link"
              target="_blank"
            >
              <div v-if="(item as any)['img']" class="rounded relative overflow-hidden max-w-[200px] h-auto">
                <NuxtImg
                  :src="(item as any)['img']" :alt="item.title"
                  :style="{
                    'object-fit': 'cover',
                    'object-position': 'center',
                    width: '100%',
                    height: '100%',
                  }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <div class="text-gray-100">{{ item.title }}</div>
                <div class="text-gray-500 text-xs">{{ item.link }}</div>
                <div class="text-gray-400 text-sm">{{ `${(item as any)["content:encodedSnippet"]}`.substring(0, 200) }}...</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>