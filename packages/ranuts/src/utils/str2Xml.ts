/**
 * @description: 传入字符串和指定的格式，将字符串转成xml
 * @param {string} xmlStr
 * @param {DOMParserSupportedType} format
 * @return {Document}
 */
const str2Xml = (xmlStr: string, format: DOMParserSupportedType = "text/xml") => {
    if (window.DOMParser) return (new window.DOMParser()).parseFromString(xmlStr, format).documentElement;
    if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        const xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    }
    return null
}

export default str2Xml