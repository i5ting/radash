/**
 * Type checking utilities
 * 类型检查工具
 */

/**
 * Check if value is undefined
 * 检查值是否为 undefined
 */
export const isSymbol = (value: any): value is symbol => {
  return !!value && value.constructor === Symbol
}

/**
 * Check if value is null
 * 检查值是否为 null
 */
export const isArray = Array.isArray

/**
 * Check if value is null or undefined
 * 检查值是否为 null 或 undefined
 */
export const isObject = (value: any): value is object => {
  return !!value && value.constructor === Object
}

/**
 * Checks if the given value is primitive.
 *
 * Primitive Types: number , string , boolean , symbol, bigint, undefined, null
 *
 * @param {*} value value to check
 * @returns {boolean} result
 */
export const isPrimitive = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value !== 'object' && typeof value !== 'function')
  )
}

/**
 * Check if value is a function
 * 检查值是否为函数
 */
export const isFunction = (value: any): value is Function => {
  return !!(value && value.constructor && value.call && value.apply)
}

/**
 * Check if value is a string
 * 检查值是否为字符串
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string' || value instanceof String
}

/**
 * Check if value is a boolean
 * 检查值是否为布尔值
 */
export const isInt = (value: any): value is number => {
  return isNumber(value) && value % 1 === 0
}

/**
 * Check if value is a number
 * 检查值是否为数字
 */
export const isFloat = (value: any): value is number => {
  return isNumber(value) && value % 1 !== 0
}

/**
 * Check if value is a number
 * 检查值是否为数字
 */
export const isNumber = (value: any): value is number => {
  try {
    return Number(value) === value
  } catch {
    return false
  }
}

/**
 * Check if value is a date
 * 检查值是否为日期
 */
export const isDate = (value: any): value is Date => {
  return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * This is really a _best guess_ promise checking. You
 * should probably use Promise.resolve(value) to be 100%
 * sure you're handling it correctly.
 */
export const isPromise = (value: any): value is Promise<any> => {
  if (!value) return false
  if (!value.then) return false
  if (!isFunction(value.then)) return false
  return true
}

/**
 * Check if value is empty
 * 检查值是否为空
 */
export const isEmpty = (value: any) => {
  if (value === true || value === false) return true
  if (value === null || value === undefined) return true
  if (isNumber(value)) return value === 0
  if (isDate(value)) return isNaN(value.getTime())
  if (isFunction(value)) return false
  if (isSymbol(value)) return false
  const length = (value as any).length
  if (isNumber(length)) return length === 0
  const size = (value as any).size
  if (isNumber(size)) return size === 0
  const keys = Object.keys(value).length
  return keys === 0
}

export const isEqual = <TType>(x: TType, y: TType): boolean => {
  if (Object.is(x, y)) return true
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime()
  }
  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString()
  }
  if (
    typeof x !== 'object' ||
    x === null ||
    typeof y !== 'object' ||
    y === null
  ) {
    return false
  }
  const keysX = Reflect.ownKeys(x as unknown as object) as (keyof typeof x)[]
  const keysY = Reflect.ownKeys(y as unknown as object)
  if (keysX.length !== keysY.length) return false
  for (let i = 0; i < keysX.length; i++) {
    if (!Reflect.has(y as unknown as object, keysX[i])) return false
    if (!isEqual(x[keysX[i]], y[keysX[i]])) return false
  }
  return true
}
