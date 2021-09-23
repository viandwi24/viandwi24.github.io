import { wrapFunctional } from './utils'

export { default as Button } from '../../components/Button.vue'
export { default as Navbar } from '../../components/Navbar.vue'

export const LazyButton = import('../../components/Button.vue' /* webpackChunkName: "components/button" */).then(c => wrapFunctional(c.default || c))
export const LazyNavbar = import('../../components/Navbar.vue' /* webpackChunkName: "components/navbar" */).then(c => wrapFunctional(c.default || c))
