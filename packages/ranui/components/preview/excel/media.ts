let cache:Array<HTMLImageElement> = [];

export function renderImage(ctx: any, medias: { [x: string]: any; }, sheet: { _media: any[]; }, offset: any){
    if(sheet && sheet._media.length){
        sheet._media.forEach((media: { imageId: any; range: any; type: any; }) => {
            const {imageId, range, type} = media;
            if(type === 'image'){
                const position = calcPosition(sheet,range,offset);
                drawImage(ctx,imageId, medias[imageId], position);
            }
        });
    }

}
const clipWidth = 60; //左侧序号列宽
const clipHeight = 25; //顶部序号行高
const defaultColWidth = 80;
const defaultRowHeight = 24;
const devicePixelRatio = window.devicePixelRatio;

function calcPosition(sheet: { _columns: { width: number; }[]; _rows: { height: any; }[]; }, range: { tl?: {} | undefined; br?: {} | undefined; }, offset: { scroll: { x: any; y: any; }; }){

    const {tl={}, br={}} = range;
    const {nativeCol, nativeColOff, nativeRow, nativeRowOff} = tl;

    let basicX = clipWidth;
    let basicY = clipHeight;
    for(let i=0; i < nativeCol; i++){
        basicX += sheet?._columns?.[i]?.width*6 || defaultColWidth;
    }
    for(let i=0; i < nativeRow; i++){
        basicY += sheet?._rows?.[i]?.height || defaultRowHeight;
    }
    const x = basicX + nativeColOff/12700;
    const y = basicY + nativeRowOff/12700;

    const {
        nativeCol: nativeColEnd,
        nativeColOff: nativeColOffEnd,
        nativeRow: nativeRowEnd,
        nativeRowOff: nativeRowOffEnd
    } = br;
    let width;
    if(nativeCol === nativeColEnd){
        width = (nativeColOffEnd - nativeColOff) / 12700;
    }else {
        width = (sheet?._columns?.[nativeCol]?.width*6 || defaultColWidth) - nativeColOff/12700;

        for(let i = nativeCol+1; i < nativeColEnd; i++){
            width += sheet?._columns?.[i]?.width*6 || defaultColWidth;
        }
        width += nativeColOffEnd / 12700;
    }
    let height;
    if(nativeRow === nativeRowEnd){
        height = (nativeRowOffEnd - nativeRowOff) / 12700;
    }else {
        height = (sheet?._rows?.[nativeRow]?.height || defaultRowHeight) - nativeRowOff/12700;
        for(let i = nativeRow+1; i < nativeRowEnd; i++){
            height += sheet?._rows?.[i]?.height || defaultRowHeight;
        }
        height += nativeRowOffEnd / 12700;
    }

    return {
        x: (x - (offset?.scroll?.x || 0)) * devicePixelRatio,
        y: (y - (offset?.scroll?.y || 0)) * devicePixelRatio,
        width: width * devicePixelRatio,
        height: height * devicePixelRatio
    };
}
export function clearCache(){
    cache = [];
}

function drawImage(ctx: { drawImage: (arg0: HTMLImageElement, arg1: number, arg2: number, arg3: number, arg4: number, arg5: any, arg6: any, arg7: any, arg8: any) => void; },index: number, data: { buffer: { buffer: any; extension: any; }; }, position: { x: any; y: any; width: any; height: any; }){
    getImage(index, data).then((image:HTMLImageElement)=>{
        let sx = 0;
        let sy = 0;
        let sWidth = image.width;
        let sHeight = image.height;
        let dx = position.x;
        let dy = position.y;
        let dWidth = position.width;
        let dHeight = position.height;
        const scaleX = dWidth / sWidth;
        const scaleY = dHeight / sHeight;

        if(dx < clipWidth * devicePixelRatio){
            const diff = clipWidth * devicePixelRatio - dx;
            dx = clipWidth * devicePixelRatio;
            dWidth -= diff;
            sWidth -= diff/scaleX;
            sx += diff/scaleX;
        }
        if(dy < clipHeight * devicePixelRatio){
            const diff = clipHeight * devicePixelRatio - dy;
            dy = clipHeight * devicePixelRatio;
            dHeight -= diff;
            sHeight -= diff/scaleY;
            sy += diff/scaleY;
        }
        ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }).catch(e=>{

    });
}
function getImage(index:number, data: { buffer: { buffer: any; extension: any; }; }){
    return new Promise(((resolve, reject) => {
        if(cache[index]){
            return resolve(cache[index]);
        }
        const {buffer, extension} = data.buffer;
        const blob = new Blob([buffer], { type: 'image/' + extension});
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.src = url;
        image.onload = function (){
            resolve(image);
            cache[index] = image;
        };
        image.onerror = function (e){
            reject(e);
        };
    }));

}
