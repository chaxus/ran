import { Noop } from './utils'

export const handleClick = (hooks:(event: MouseEvent) => void = Noop): void => {
    document.addEventListener('click', function (event) { hooks(event) }, true);
}