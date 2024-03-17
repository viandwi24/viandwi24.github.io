<script lang="ts" setup>
import dayjs from 'dayjs'

interface Line {
  title: string
  description: string
  dayjs: dayjs.Dayjs
}
const props = defineProps({
  lines: {
    type: Array as PropType<Line[]>,
    required: true
  }
})

const isMobile = ref(false)
const checkMobile = () => {
  if (!window) return
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="p-6 relative flex-1" v-if="!isMobile">
    <div class="h-full w-2 bg-gray-500/50 absolute top-0 left-[50%] transform -translate-x-1/2 -z-0"></div>
    <div class="flex flex-col gap-6">
      <div
        v-for="(item, i) in lines"
        class="flex flex-row w-full"
        :class="{
          'justify-start': i % 2 == 0,
          'justify-end':  i % 2 == 1
        }"
      >
        <div class="flex w-1/2" :class="{ ' flex-row-reverse': i % 2 == 0 }">
          <div class="h-4 w-4 rounded bg-primary-500 z-[1] mt-[1px]" :class="{ '-m-2': true }" />
          <div class="p-4 rounded border border-gray-500/50 w-[320px]" :class="{ 'mr-8 text-right': i % 2 == 0, 'ml-8': i % 2 == 1 }">
            <div class="text-xs italic text-primary-500 mb-1">{{ item.dayjs.format('MMM D, YYYY') }}</div>
            <div class="text-sm mb-1" v-html="item.title"></div>
            <div class="text-xs text-gray-400" v-html="item.description" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="p-6 relative flex-1" v-if="isMobile">
    <div class="h-full w-2 bg-gray-500/50 absolute top-0 right-[10px] transform -translate-x-1/2 -z-0"></div>
    <div class="flex flex-col gap-6">
      <div
        v-for="(item, i) in lines"
        class="flex flex-row w-full justify-end"
      >
        <div class="flex flex-row-reverse">
          <div class="h-4 w-4 rounded bg-primary-500 z-[1] mt-[1px]" :class="{ '-m-[0.9rem]': true }" />
          <div class="p-4 rounded border border-gray-500/50 w-full mr-8">
            <div class="text-xs italic text-primary-500 mb-1">{{ item.dayjs.format('MMM D, YYYY') }}</div>
            <div class="text-sm mb-1" v-html="item.title"></div>
            <div class="text-xs text-gray-400" v-html="item.description" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>