import { throttle } from './utils'
import { report } from './report'
import type { Payload } from './index'


export const handleClick = ({ url, payload }: Payload): void => {
    const throttleReport = throttle(report)
    document.addEventListener(
        'click',
        function () {
            throttleReport({
                url,
                payload: {
                    ...payload,
                    behavior: 'click',
                    data: this,
                }
            })
        },
        true
    );
}