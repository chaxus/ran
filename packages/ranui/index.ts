import './components.ts'
import styles from './base.less'
if (typeof document !== "undefined") {
    const style = document.createElement('style')
    style.textContent = styles
    document.body.appendChild(style)
}
