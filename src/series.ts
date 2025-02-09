import { list } from './array'

/**
 * Series of async operations utilities
 * 异步操作序列工具
 */

/**
 * Creates a series object around a list of values
 * that should be treated with order.
 */
export const series = <T>(
  items: T[],
  toKey: (item: T) => string | symbol = item => `${item}`
) => {
  const { indexesByKey, itemsByIndex } = items.reduce(
    (acc, item, idx) => ({
      indexesByKey: {
        ...acc.indexesByKey,
        [toKey(item)]: idx
      },
      itemsByIndex: {
        ...acc.itemsByIndex,
        [idx]: item
      }
    }),
    {
      indexesByKey: {} as Record<string | symbol, number>,
      itemsByIndex: {} as Record<number, T>
    }
  )
  /**
   * Given two values in the series, returns the
   * value that occurs earlier in the series
   * 给定序列中的两个值，返回在序列中较早出现的值
   */
  const min = (a: T, b: T): T => {
    return indexesByKey[toKey(a)] < indexesByKey[toKey(b)] ? a : b
  }
  /**
   * Given two values in the series, returns the
   * value that occurs later in the series
   * 给定序列中的两个值，返回在序列中较晚出现的值
   */
  const max = (a: T, b: T): T => {
    return indexesByKey[toKey(a)] > indexesByKey[toKey(b)] ? a : b
  }
  /**
   * Returns the first item from the series
   * 返回序列中的第一个项
   */
  const first = (): T => {
    return itemsByIndex[0]
  }
  /**
   * Returns the last item in the series
   * 返回序列中的最后一个项
   */
  const last = (): T => {
    return itemsByIndex[items.length - 1]
  }
  /**
   * Given an item in the series returns the next item
   * in the series or default if the given value is
   * the last item in the series
   * 给定序列中的一个项，返回序列中的下一个项，
   * 如果给定值是序列中的最后一个项，则返回默认值
   */
  const next = (current: T, defaultValue?: T): T => {
    return (
      itemsByIndex[indexesByKey[toKey(current)] + 1] ?? defaultValue ?? first()
    )
  }
  /**
   * Given an item in the series returns the previous item
   * in the series or default if the given value is
   * the first item in the series
   * 给定序列中的一个项，返回序列中的上一个项，
   * 如果给定值是序列中的第一个项，则返回默认值
   */
  const previous = (current: T, defaultValue?: T): T => {
    return (
      itemsByIndex[indexesByKey[toKey(current)] - 1] ?? defaultValue ?? last()
    )
  }
  /**
   * A more dynamic method than next and previous that
   * lets you move many times in either direction.
   * 比 next 和 previous 更动态的方法，允许在任意方向移动多次。
   * 这个有趣。
   * @example series(weekdays).spin('wednesday', 3) => 'monday'
   * @example series(weekdays).spin('wednesday', -3) => 'friday'
   */
  const spin = (current: T, num: number): T => {
    if (num === 0) return current
    const abs = Math.abs(num)
    const rel = abs > items.length ? abs % items.length : abs
    return list(0, rel - 1).reduce(
      acc => (num > 0 ? next(acc) : previous(acc)),
      current
    )
  }
  return {
    min,
    max,
    first,
    last,
    next,
    previous,
    spin
  }
}

/**
 * Execute async functions in series
 * 按顺序执行异步函数
 */

/**
 * Map array through async function in series
 * 通过异步函数按顺序映射数组
 */
