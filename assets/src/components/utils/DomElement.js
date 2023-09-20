/**
 * Find a parent by class name
 * 
 * @param {*} element 
 * @param {*} className 
 * @returns 
 */
export function findParent(element, className) {

    if(className === undefined) {
        return null
    }

    let e = null
    let elements = []

    while(element) {
        elements.unshift(element)
        element = element.parentNode
        if(element !== null && element.className === className) {
            e = element
            break
        }
    }

    return e
}

/**
 * Find a child by class name or tag name
 * 
 * @param {*} element 
 * @param {*} className 
 * @param {*} tagName 
 * @returns 
 */
export function findChildren(element, className, tagName = null) {
    let 
        childrens = element.children, 
        findElement = null
    ;

    if(tagName !== null) {
        tagName = tagName.toUpperCase()
    }
    
    for(let i = 0; i < childrens.length; i++) {
        console.log(
            tagName,
            childrens[i].tagName,
            childrens[i].tagName === tagName
        )
        if(
            (className && childrens[i] && childrens[i].className.includes(className)) ||
            (tagName && childrens[i] && childrens[i].tagName === tagName)
        ) {
            findElement = childrens[i]
            break
        }
    }

    return findElement
}