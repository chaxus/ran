import { defineConfig } from 'vite'
import { umd, viteConfig } from '../vite.config'

viteConfig.build = umd

export default defineConfig(viteConfig)
