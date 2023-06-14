export interface changeContrastTypes{
    image: {
        height?: null | number,
        width?: null | number,
        uri: string,
        localUri: string,
        downloaded?: boolean,
        downloading?: boolean,
        hash?: null | string,
        name: string,
        type:string,
    },
    contrast: number,
    snapshotOptions:{
        compress?: number,
        flip?: boolean,
        format?:'jpeg' | 'png' | 'webp',
        framebuffer?: WebGLFramebuffer,
        rect?:{
            height: number, 
            width: number, 
            x: number, 
            y: number
        }
    }
}

export interface resizeImageTypes{
    originalImage: {
        height?: null | number,
        width?: null | number,
        uri: string,
        localUri: string,
        downloaded?: boolean,
        downloading?: boolean,
        hash?: null | string,
        name: string,
        type: string,
    },
    outputWidth: number,
    outputHeight: number,
    snapshotOptions:{
        compress?: number,
        flip?: boolean,
        format?:'jpeg' | 'png' | 'webp',
        framebuffer?: WebGLFramebuffer,
        rect?:{
            height: number, 
            width: number, 
            x: number, 
            y: number
        }
    }
}