import './app.css'
import App from './App.svelte'
import { mount } from 'svelte'

// Create the app and mount it to the DOM
const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app