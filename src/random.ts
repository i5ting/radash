import { iterate } from './array'

/**
 * Random generation utilities
 * 随机生成工具
 */

/**
 * Generate random integer between min and max
 * 生成介于最小值和最大值之间的随机整数
 */
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generate random float between min and max
 * 生成介于最小值和最大值之间的随机浮点数
 */
export const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

/**
 * Get random item from array
 * 从数组中获取随机项
 */
export const draw = <T>(array: readonly T[]): T | null => {
  // 获取数组长度作为最大值
  const max = array.length
  // 如果数组为空，返回 null
  if (max === 0) {
    return null
  }
  // 生成 0 到 max-1 之间的随机索引
  const index = random(0, max - 1)
  // 返回随机索引对应的数组元素
  return array[index]
}

export const shuffle = <T>(array: readonly T[]): T[] => {
  return array
    .map(a => ({ rand: Math.random(), value: a }))
    .sort((a, b) => a.rand - b.rand)
    .map(a => a.value)
}

export const uid = (length: number, specials: string = '') => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + specials
  return iterate(
    length,
    acc => {
      return acc + characters.charAt(random(0, characters.length - 1))
    },
    ''
  )
}
