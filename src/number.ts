/**
 * Number manipulation utilities
 * 数字操作工具
 */

/**
 * Checks if the given number is between zero (0) and the ending number. 0 is inclusive.
 *
 * * Numbers can be negative or positive.
 * * Ending number is exclusive.
 *
 * @param {number} number The number to check.
 * @param {number} end The end of the range. Exclusive.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRange(number: number, end: number): boolean // 声明第一个重载函数签名

/**
 * Checks if the given number is between two numbers.
 *
 * * Numbers can be negative or positive.
 * * Starting number is inclusive.
 * * Ending number is exclusive.
 * * The start and the end of the range can be ascending OR descending order.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range. Inclusive.
 * @param {number} end The end of the range. Exclusive.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRange(number: number, start: number, end: number): boolean // 声明第二个重载函数签名
export function inRange(number: number, start: number, end?: number): boolean {
  // 实现函数
  const isTypeSafe = // 检查参数类型是否安全
    typeof number === 'number' && // 检查 number 参数是否为数字类型
    typeof start === 'number' && // 检查 start 参数是否为数字类型
    (typeof end === 'undefined' || typeof end === 'number') // 检查 end 参数是否为 undefined 或数字类型

  if (!isTypeSafe) {
    // 如果类型不安全
    return false // 返回 false
  }

  if (typeof end === 'undefined') {
    // 如果没有提供 end 参数
    end = start // 将 start 赋值给 end
    start = 0 // start 设为 0
  }

  return number >= Math.min(start, end) && number < Math.max(start, end) // 检查数字是否在范围内
}

export const toFloat = <T extends number | null = number>( // 定义转换为浮点数的函数
  value: any, // 要转换的值
  defaultValue?: T // 可选的默认值
): number | T => {
  const def = defaultValue === undefined ? 0.0 : defaultValue // 设置默认值
  if (value === null || value === undefined) {
    // 如果值为 null 或 undefined
    return def // 返回默认值
  }
  const result = parseFloat(value) // 转换为浮点数
  return isNaN(result) ? def : result // 如果转换结果为 NaN 则返回默认值，否则返回转换结果
}

export const toInt = <T extends number | null = number>( // 定义转换为整数的函数
  value: any, // 要转换的值
  defaultValue?: T // 可选的默认值
): number | T => {
  const def = defaultValue === undefined ? 0 : defaultValue // 设置默认值
  if (value === null || value === undefined) {
    // 如果值为 null 或 undefined
    return def // 返回默认值
  }
  const result = parseInt(value) // 转换为整数
  return isNaN(result) ? def : result // 如果转换结果为 NaN 则返回默认值，否则返回转换结果
}

/**
 * Clamp number between min and max
 * 将数字限制在最小值和最大值之间
 *
 * @param {number} number The number to clamp
 * @param {number} min The minimum value
 * @param {number} max The maximum value
 * @returns {number} Returns the clamped number
 *
 * @param {number} number 要限制的数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 返回限制后的数字
 */

/**
 * Round number to specified decimal places
 * 将数字四舍五入到指定的小数位
 *
 * @param {number} number The number to round
 * @param {number} decimals The number of decimal places
 * @returns {number} Returns the rounded number
 *
 * @param {number} number 要四舍五入的数字
 * @param {number} decimals 小数位数
 * @returns {number} 返回四舍五入后的数字
 */
