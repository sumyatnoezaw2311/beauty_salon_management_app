export const formatCode = (code)=>{
    const formattedCode = code.match(/.{1,3}/g).join('-');
    return formattedCode
}