

/**
 * This helps you to get a file extension.
 *
 * @param {string} fileName
 * @return {string} extension
 */
export const getExtension: (fileName: string) => string = fileName => {

    let extension: string = ''
    const periodPosition: number = fileName.lastIndexOf('.')
    if (periodPosition !== -1) {
        extension = fileName.slice(periodPosition + 1).toLowerCase();
    }
    return extension
}

/**
 * This helps you to check a file extension is allowed.
 *
 * @param {string} fileName
 * @return {boolean} 
 */
export const isAllowedAudioFormat: (fileName: string) => boolean = (fileName) => {
    
    // Only allowed in below extensions
    const allowExtentions: Array<string> = ['mp3', 'mp4', 'm4a']

    const extension: string = getExtension(fileName)
    if (allowExtentions.indexOf(extension) !== -1) {
        return true
    }else{
        return false
    }

}