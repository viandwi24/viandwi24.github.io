<template>
  <section class="flex-1 flex flex-col justify-center page-section page-section-experience">
    <div class="flex-1 flex flex-col w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10">
      <div class="page-section-header mb-4 text-custom-1">
        <span>03.</span>
        <span>My Experience</span>
      </div>
      <div class="px-4 flex-1 pr-6 mb-28">
        <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2">
          <HeadlessTabGroup :vertical="true">
            <HeadlessTabList class="w-full lg:w-2/8 flex flex-col justify-start items-start">
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">EDUCATION</button>
              </HeadlessTab>
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 outline-none ring-transparent transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">LSP</button>
              </HeadlessTab>
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 outline-none ring-transparent transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">FLAGZ</button>
              </HeadlessTab>
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 outline-none ring-transparent transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">GENTLEDESIGN</button>
              </HeadlessTab>
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 outline-none ring-transparent transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">TELEAL</button>
              </HeadlessTab>
              <HeadlessTab #="{ selected }">
                <button class="border-l-4 outline-none ring-transparent transition-all duration-300 pl-4 py-2"
                  :class="{ 'border-primary-500': selected, 'border-slate-600': !selected }">NOKIAMON</button>
              </HeadlessTab>
            </HeadlessTabList>
            <HeadlessTabPanels class="flex-1">
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    a College Student at <span class="text-primary-500">@Surabaya State University</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    Sep 2020 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>
                      <div class="font-bold text-primary font-mono">Elementary School</div>
                      <div>SDN Kedung Maling 2</div>
                      <div class="fw-lighter text-sm text-custom-1">Address: dsn. Kedung Maling, Kec. Sooko, Kab.
                        Mojokerto, Jawa Timur, Indonesia.</div>
                    </li>
                    <li>
                      <div class="font-bold text-primary font-mono">Junior Hight School</div>
                      <div>SMPN 1 SOOKO</div>
                      <div class="text-sm text-custom-1">Address: Kec. Sooko, Kab. Mojokerto, Jawa Timur, Indonesia.
                      </div>
                    </li>
                    <li>
                      <div class="font-bold text-primary font-mono">High School</div>
                      <div>SMKN 1 KOTA MOJOKERTO</div>
                      <div>Field: Computer & Network Engineering</div>
                      <div class="text-sm text-custom-1">Address: Kec. Magersari, Mojokerto, Jawa Timur, Indonesia.
                      </div>
                    </li>
                    <li>
                      <div class="font-bold text-primary font-mono">Bachelor's Degree (On Progress)</div>
                      <div>Surabaya State University</div>
                      <div>Field: Informatics Engineering</div>
                      <div class="text-sm text-custom-1">Address: Jl. Ketintang, Ketintang, Kec. Gayungan, Kota
                        Surabaya, Jawa Timur 60231.</div>
                    </li>
                  </ul>
                </div>
              </HeadlessTabPanel>
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    Programmer & Web Admin <span class="text-primary-500">@LSP SMKN 1 MOJOKERTO</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    Nov 2019 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>i design and create web pages for lsp web interface.</li>
                    <li>I made web services api backend.</li>
                    <li>I maintain the server system.</li>
                  </ul>
                </div>
              </HeadlessTabPanel>
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    Web Game Developer <span class="text-primary-500">@FLAGZ</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    Jan 2022 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>I am designing a multiplayer rpg top down pixel web based game using Phaser.js and Voice call</li>
                  </ul>
                </div>
              </HeadlessTabPanel>
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    FRONTEND Developer <span class="text-primary-500">@GENTLEDESIGN</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    Nov 2022 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>I design a landing page display page for a company.</li>
                    <li>receive website creation services from related companies.</li>
                  </ul>
                </div>
              </HeadlessTabPanel>
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    Fullstack Developers <span class="text-primary-500">@TELEAL</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    OKT 2022 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>create a business page.</li>
                    <li>create a telegram bot.</li>
                    <li>create a tradingview scrapper</li>
                  </ul>
                </div>
              </HeadlessTabPanel>
              <HeadlessTabPanel>
                <div class="tab-custom-pane-header mb-4">
                  <div class="text-blue-200">
                    Web3 Developer <span class="text-primary-500">@NOKIAMON</span>
                  </div>
                  <div class="text-sm text-slate-400 font-mono">
                    Jan 2022 - Now
                  </div>
                </div>
                <div>
                  <ul class="list-custom">
                    <li>maintance server</li>
                    <li>create mobile apps with react native and connect to solana wallet</li>
                    <li>create xnft apps in backpack wallet</li>
                    <li>create smart contract for Badges Features</li>
                    <li>create smart contract for Burn 2 Mint Events</li>
                  </ul>
                </div>
              </HeadlessTabPanel>
            </HeadlessTabPanels>
          </HeadlessTabGroup>
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
