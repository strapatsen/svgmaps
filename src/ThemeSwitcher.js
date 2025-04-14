export class ThemeSwitcher {
    constructor(container = document.body) {
      this.container = container
      this.themeOptions = [
        { name: 'default', icon: '🌙', label: 'Dark' },
        { name: 'light', icon: '🌞', label: 'Light' },
        
      ]
      this.render()
      this.init()
      this.addMobileDropdown()
    }
  
    render() {
      this.wrapper = document.createElement('div')
      this.wrapper.classList.add('theme-switcher')
      this.themeOptions.forEach(({ name, icon }) => {
        const btn = document.createElement('button')
        btn.dataset.theme = name
        btn.textContent = icon
        if (ThemeManager.current === name) btn.classList.add('active')
        btn.addEventListener('click', () => this.setTheme(name))
        this.wrapper.appendChild(btn)
      })
      
      this.container.appendChild(this.wrapper)
    }
  
    setTheme(themeName) {
      const html = document.documentElement
      html.classList.add('theme-fade')
      setTimeout(() => {
        ThemeManager.set(themeName)
        const buttons = this.wrapper.querySelectorAll('button')
        buttons.forEach(b => b.classList.remove('active'))
        const active = this.wrapper.querySelector(`[data-theme="${themeName}"]`)
        if (active) active.classList.add('active')
        if (this.select) this.select.value = themeName
        html.classList.remove('theme-fade')
      }, 150)
    }
  
    init() {
      const saved = localStorage.getItem('ui-theme') || ThemeManager.current
      this.setTheme(saved)
    }
  
    addMobileDropdown() {
      const select = document.createElement('select')
      select.classList.add('theme-switcher-select')
      this.themeOptions.forEach(({ name, label }) => {
        const opt = document.createElement('option')
        opt.value = name
        opt.textContent = label
        select.appendChild(opt)
      })
      select.value = ThemeManager.current
      select.addEventListener('change', e => this.setTheme(e.target.value))
      this.container.appendChild(select)
      this.select = select
  
      const mediaQuery = window.matchMedia('(max-width: 600px)')
      const toggleVisibility = () => {
        this.wrapper.style.display = mediaQuery.matches ? 'none' : 'flex'
        select.style.display = mediaQuery.matches ? 'block' : 'none'
      }
      toggleVisibility()
      mediaQuery.addEventListener('change', toggleVisibility)
    }

    resetTheme() {
      localStorage.removeItem('ui-theme')
      this.setTheme('default')
    }
}
  

/*

import { ThemeSwitcher } from './ThemeSwitcher.js'

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init()
  const themeSwitcher = new ThemeSwitcher(document.querySelector('.toolbar') || document.body)
  const resetBtn = document.querySelector('.reset-theme')
  resetBtn.addEventListener('click', () => themeSwitcher.resetTheme())

})

*/