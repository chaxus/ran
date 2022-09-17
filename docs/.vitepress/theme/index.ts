import Theme from 'vitepress/dist/client/theme-default'
import '../../../src/index'

export default {
    ...Theme,
    enhanceApp({ app }) {
        app.config.compilerOptions = {
            isCustomElement: tag => tag.startsWith('-')
        }
    }
}