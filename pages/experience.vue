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

const techStacks = ref<{
  category: string
  items: [string, number, string][]
}[]>([
  {
    category: 'Programming Languages',
    items: [
      ['Html', 2014, 'https://seeklogo.com/images/H/html5-without-wordmark-color-logo-14D252D878-seeklogo.com.png'],
      ['Css', 2014, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/48px-CSS3_logo.svg.png'],
      ['JavaScript', 2014, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png'],
      ['VB6', 2015, 'https://www.vectorlogo.zone/logos/microsoft_vb/microsoft_vb-icon.svg'],
      ['.NET', 2016, 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Microsoft_.NET_logo.svg'],
      ['PHP', 2017, 'https://www.vectorlogo.zone/logos/php/php-icon.svg'],
      ['Java', 2018, 'https://www.vectorlogo.zone/logos/java/java-icon.svg'],
      ['C++', 2018, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/306px-ISO_C%2B%2B_Logo.svg.png'],
      ['C#', 2018, 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png?20180210215736'],
      ['Typescript', 2019, 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg'],
      ['SASS', 2019, 'https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg'],
      ['Python', 2019, 'https://www.vectorlogo.zone/logos/python/python-icon.svg'],
      ['Golang', 2022, 'https://www.vectorlogo.zone/logos/golang/golang-icon.svg'],
      ['Rust', 2023, 'https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg'],
    ]
  },
  {
    category: 'Frameworks',
    items: [
      // list all of this : nodejs-2019, deno-2019, bunjs-2023, codeigniter-2017, laravel-2018
      ['Codeigniter', 2017, 'https://codeigniter.com/assets/icons/44521256.png'],
      ['Bootstrap', 2017, 'https://www.vectorlogo.zone/logos/getbootstrap/getbootstrap-icon.svg'],
      ['JQuery', 2017, 'https://www.vectorlogo.zone/logos/jquery/jquery-icon.svg'],
      ['Laravel', 2018, 'https://www.vectorlogo.zone/logos/laravel/laravel-icon.svg'],
      ['Unity', 2018, 'https://www.vectorlogo.zone/logos/unity3d/unity3d-icon.svg'],
      ['Vue', 2019, 'https://www.vectorlogo.zone/logos/vuejs/vuejs-icon.svg'],
      ['Nuxt', 2019, 'https://www.vectorlogo.zone/logos/nuxtjs/nuxtjs-icon.svg'],
      ['Tailwind', 2019, 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg'],
      ['Flutter', 2019, 'https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg'],
      ['Phaser', 2020, 'https://www.vectorlogo.zone/logos/phaserio/phaserio-icon.svg'],
      ['Flask', 2021, 'https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg'],
      ['Express', 2021, 'https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg'],
      ['React', 2021, 'https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg'],
      ['GraphQL', 2021, 'https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg'],
      ['Next', 2023, 'https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png'],
    ]
  },
  {
    category: 'Tools & Runtime',
    items: [
      ['Nodejs', 2019, 'https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg'],
      ['Deno', 2020, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Deno_2021.svg/512px-Deno_2021.svg.png'],
      ['Bun', 2023, 'https://bun.sh/logo.svg'],
    ]
  },
  {
    category: 'DevOps',
    items: [
      // list : docker-2020, github-action-2021, kubernetes-2023, terraform-2023, jenkins-2024
      ['Docker', 2020, 'https://www.vectorlogo.zone/logos/docker/docker-icon.svg'],
      ['PM2', 2020, 'https://www.vectorlogo.zone/logos/pm2io/pm2io-icon.svg'],
      ['GAction', 2021, 'https://www.vectorlogo.zone/logos/github/github-icon.svg'],
      ['Kubernetes', 2023, 'https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg'],
      ['Terraform', 2023, 'https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg'],
      ['Jenkins', 2024, 'https://www.vectorlogo.zone/logos/jenkins/jenkins-icon.svg'],
    ]
  },
  {
    category: 'Database',
    items: [
      // list : mysql-2017, postgresql-2018, mongodb-2020, redis-2020, sqlite-2021
      ['Mysql', 2017, 'https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg'],
      ['Postgresql', 2018, 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg'],
      ['Firebase', 2019, 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg'],
      ['Mongodb', 2020, 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg'],
      ['Redis', 2020, 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg'],
      ['Sqlite', 2021, 'https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg'],
    ]
  },
  {
    category: 'Operating System',
    items: [
      ['Windows', 2010, 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg'],
      ['Ubuntu', 2017, 'https://www.vectorlogo.zone/logos/ubuntu/ubuntu-icon.svg'],
      ['Debian', 2018, 'https://www.vectorlogo.zone/logos/debian/debian-icon.svg'],
      ['CentOS', 2020, 'https://www.vectorlogo.zone/logos/centos/centos-icon.svg'],
      ['MacOS', 2020, 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg'],
    ]
  },
  {
    category: 'Cloud',
    items: [
      // list: aws-2019, gcp-2021
      ['AWS', 2019, 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg'],
      ['GCP', 2021, 'https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg'],
    ]
  }
])

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


const techStackSearch = ref('')
</script>

<template>
  <section class="flex-1 flex flex-col justify-center page-section page-section-experience">
    <div class="flex-1 flex flex-col w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10 justify-center">
      <div class="page-section-header mb-4 text-custom-1">
        <span>03.</span>
        <span>My Experience</span>
      </div>
      <div class="px-4 pr-6 flex flex-col">
        <div>
          <ClientOnly>
            <div class="flex flex-col min-h-[500px]">
              <HeadlessTabGroup :vertical="true">
                <HeadlessTabList class="w-full lg:w-1/4 flex justify-start items-start">
                  <HeadlessTab 
                      v-for="(item, i) in ['Journey', 'Tech Stack']"
                      :key="i"
                      #="{ selected }"
                    >
                    <button
                      :class="{
                        'border-b-4 transition-all duration-300 px-4 py-2': true,
                        'border-primary-500': selected,
                        'border-slate-600': !selected
                      }"
                    >
                      {{ item }}
                    </button>
                  </HeadlessTab>
                </HeadlessTabList>
                <HeadlessTabPanels class="flex-1 pt-6">
                  <!-- journey -->
                  <HeadlessTabPanel>
                    <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2">
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
                    </div>
                  </HeadlessTabPanel>
                  
                  <!-- tech stack -->
                  <HeadlessTabPanel class="flex flex-col">
                    <div class="flex justify-end items-center mb-4">
                      <input
                        v-model="techStackSearch"
                        type="text"
                        class="border border-gray-500/50 rounded px-4 py-2 text-sm bg-gray-900/50 text-slate-400 font-mono"
                        placeholder="search"
                      />
                    </div>
                    <div
                      class="flex flex-col gap-8"
                    >
                      <div v-for="(item, i) in techStacks" :key="i">
                        <div class="font-bold text-xl mb-4">
                          # {{ item.category }}
                        </div>
                        <div
                          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2"
                        >
                          <div
                            v-for="(tech, j) in item.items.filter((tech) => tech[0].toLowerCase().includes(techStackSearch.toLowerCase()))"
                            :key="j"
                            class="transition-all duration-300 flex flex-col items-center justify-center border p-4 rounded bg-gray-900 border-gray-500/50 hover:border-primary-500/50 hover:bg-primary-500/50"
                          >
                            <div class="font-semibold text-sm text-slate-400 font-mono mb-3 text-center">
                              {{ tech[0] }}
                            </div>
                            <div class="w-12 h-12 mb-3">
                              <NuxtImg
                                :src="tech[2]"
                                :alt="tech[0]"
                                :style="{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center'
                                }"
                              />
                            </div>
                            <div class="text-[10px] text-slate-400 font-mono mb-2 text-center">
                              learn on {{ tech[1] }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HeadlessTabPanel>
                </HeadlessTabPanels>
              </HeadlessTabGroup>
            </div>
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
