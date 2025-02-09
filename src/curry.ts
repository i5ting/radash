/**
 * Function currying utilities
 * 函数柯里化工具
 */

/**
 * Curry a function
 * 柯里化一个函数
 */
// Curry function takes a function and returns a curried version of it
// 柯里化函数接收一个函数并返回它的柯里化版本

// 定义 chain 函数,用于将多个函数串联起来
export function chain<T1 extends any[], T2, T3>(
  f1: (...arg: T1) => T2, // 第一个函数,接收任意参数返回 T2 类型
  f2: (arg: T2) => T3 // 第二个函数,接收 T2 类型参数返回 T3 类型
): (...arg: T1) => T3 // 返回一个函数,接收与 f1 相同的参数,返回 T3 类型

// 定义 chain 函数重载,支持 3 个函数串联
export function chain<T1 extends any[], T2, T3, T4>(
  f1: (...arg: T1) => T2, // 第一个函数
  f2: (arg: T2) => T3, // 第二个函数
  f3: (arg: T3) => T4 // 第三个函数
): (...arg: T1) => T4 // 返回函数

// 定义 chain 函数重载,支持 4 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5
): (...arg: T1) => T5

// 定义 chain 函数重载,支持 5 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5, T6>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6
): (...arg: T1) => T6

// 定义 chain 函数重载,支持 6 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5, T6, T7>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6,
  f6: (arg: T3) => T7
): (...arg: T1) => T7

// 定义 chain 函数重载,支持 7 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5, T6, T7, T8>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6,
  f6: (arg: T3) => T7,
  f7: (arg: T3) => T8
): (...arg: T1) => T8

// 定义 chain 函数重载,支持 8 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5, T6, T7, T8, T9>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6,
  f6: (arg: T3) => T7,
  f7: (arg: T3) => T8,
  f8: (arg: T3) => T9
): (...arg: T1) => T9

// 定义 chain 函数重载,支持 9 个函数串联
export function chain<T1 extends any[], T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6,
  f6: (arg: T3) => T7,
  f7: (arg: T3) => T8,
  f8: (arg: T3) => T9,
  f9: (arg: T3) => T10
): (...arg: T1) => T10

// 定义 chain 函数重载,支持 10 个函数串联
export function chain<
  T1 extends any[],
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11
>(
  f1: (...arg: T1) => T2,
  f2: (arg: T2) => T3,
  f3: (arg: T3) => T4,
  f4: (arg: T3) => T5,
  f5: (arg: T3) => T6,
  f6: (arg: T3) => T7,
  f7: (arg: T3) => T8,
  f8: (arg: T3) => T9,
  f9: (arg: T3) => T10,
  f10: (arg: T3) => T11
): (...arg: T1) => T11

// chain 函数的具体实现
export function chain(...funcs: ((...args: any[]) => any)[]) {
  return (...args: any[]) => {
    // 使用 reduce 依次执行函数链,将前一个函数的结果作为下一个函数的输入

    // return funcs.slice(1).reduce(function (acc, fn) {
    //   return fn(acc)
    // }, funcs[0](...args))
    //
    // 使用 reduce 依次执行函数链
    // 第一个函数 funcs[0] 接收原始参数 args 并返回结果
    // 后续函数 fn 依次接收前一个函数的结果 acc 作为输入
    // 最终返回最后一个函数的执行结果
    // 注意：最后一个参数funcs[0](...args)，改变里原来的funcs
    return funcs.slice(1).reduce((acc, fn) => fn(acc), funcs[0](...args))
  }
}

// compose 函数重载,支持 2 个函数组合
/**
 * compose函数与koa-compose的主要区别:

1. 类型系统不同:
- compose使用TypeScript的泛型和函数重载,提供了更严格的类型检查
- koa-compose使用middleware类型,更专注于HTTP中间件场景

2. 执行顺序不同:
- compose从左到右执行,前一个函数的结果作为下一个函数的输入
- koa-compose洋葱模型,先从外到内执行,再从内到外返回

3. 使用场景不同:
- compose用于普通函数组合,更通用
- koa-compose专门用于Koa中间件,处理HTTP请求响应

4. 参数传递不同:
- compose每个函数接收单个next函数
- koa-compose中间件接收context和next两个参数

5. 异步处理不同:
- compose主要处理同步函数组合
- koa-compose处理异步中间件,返回Promise
*/

export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => LastResult
  ) => (...args: F1Args) => F1Result,
  last: (...args: F1NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 3 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2Result,
  F2NextArgs extends any[],
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => LastResult
  ) => (...args: F1NextArgs) => F2Result,
  last: (...args: F2NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 4 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => LastResult
  ) => (...args: F2NextArgs) => F3Result,
  last: (...args: F3NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 5 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => LastResult
  ) => (...args: F3NextArgs) => F4Result,
  last: (...args: F4NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 6 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  F5NextArgs extends any[],
  F5Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => F5Result
  ) => (...args: F3NextArgs) => F4Result,
  f5: (
    next: (...args: F5NextArgs) => LastResult
  ) => (...args: F4NextArgs) => F5Result,
  last: (...args: F5NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 7 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  F5NextArgs extends any[],
  F5Result,
  F6NextArgs extends any[],
  F6Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => F5Result
  ) => (...args: F3NextArgs) => F4Result,
  f5: (
    next: (...args: F5NextArgs) => F6Result
  ) => (...args: F4NextArgs) => F5Result,
  f6: (
    next: (...args: F6NextArgs) => LastResult
  ) => (...args: F5NextArgs) => F6Result,
  last: (...args: F6NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 8 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  F5NextArgs extends any[],
  F5Result,
  F6NextArgs extends any[],
  F6Result,
  F7NextArgs extends any[],
  F7Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => F5Result
  ) => (...args: F3NextArgs) => F4Result,
  f5: (
    next: (...args: F5NextArgs) => F6Result
  ) => (...args: F4NextArgs) => F5Result,
  f6: (
    next: (...args: F6NextArgs) => F7Result
  ) => (...args: F5NextArgs) => F6Result,
  f7: (
    next: (...args: F7NextArgs) => LastResult
  ) => (...args: F6NextArgs) => F7Result,
  last: (...args: F7NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 9 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  F5NextArgs extends any[],
  F5Result,
  F6NextArgs extends any[],
  F6Result,
  F7NextArgs extends any[],
  F7Result,
  F8NextArgs extends any[],
  F8Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => F5Result
  ) => (...args: F3NextArgs) => F4Result,
  f5: (
    next: (...args: F5NextArgs) => F6Result
  ) => (...args: F4NextArgs) => F5Result,
  f6: (
    next: (...args: F6NextArgs) => F7Result
  ) => (...args: F5NextArgs) => F6Result,
  f7: (
    next: (...args: F7NextArgs) => LastResult
  ) => (...args: F6NextArgs) => F7Result,
  f8: (
    next: (...args: F8NextArgs) => LastResult
  ) => (...args: F7NextArgs) => F8Result,
  last: (...args: F8NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数重载,支持 10 个函数组合
export function compose<
  F1Result,
  F1Args extends any[],
  F1NextArgs extends any[],
  F2NextArgs extends any[],
  F2Result,
  F3NextArgs extends any[],
  F3Result,
  F4NextArgs extends any[],
  F4Result,
  F5NextArgs extends any[],
  F5Result,
  F6NextArgs extends any[],
  F6Result,
  F7NextArgs extends any[],
  F7Result,
  F8NextArgs extends any[],
  F8Result,
  F9NextArgs extends any[],
  F9Result,
  LastResult
>(
  f1: (
    next: (...args: F1NextArgs) => F2Result
  ) => (...args: F1Args) => F1Result,
  f2: (
    next: (...args: F2NextArgs) => F3Result
  ) => (...args: F1NextArgs) => F2Result,
  f3: (
    next: (...args: F3NextArgs) => F4Result
  ) => (...args: F2NextArgs) => F3Result,
  f4: (
    next: (...args: F4NextArgs) => F5Result
  ) => (...args: F3NextArgs) => F4Result,
  f5: (
    next: (...args: F5NextArgs) => F6Result
  ) => (...args: F4NextArgs) => F5Result,
  f6: (
    next: (...args: F6NextArgs) => F7Result
  ) => (...args: F5NextArgs) => F6Result,
  f7: (
    next: (...args: F7NextArgs) => LastResult
  ) => (...args: F6NextArgs) => F7Result,
  f8: (
    next: (...args: F8NextArgs) => LastResult
  ) => (...args: F7NextArgs) => F8Result,
  f9: (
    next: (...args: F9NextArgs) => LastResult
  ) => (...args: F8NextArgs) => F9Result,
  last: (...args: F9NextArgs) => LastResult
): (...args: F1Args) => F1Result

// compose 函数的具体实现
export function compose(...funcs: ((...args: any[]) => any)[]) {
  // 反转函数数组并使用 reduce 依次执行
  return funcs.reverse().reduce((acc, fn) => fn(acc))
}

/**
 * This type produces the type array of TItems with all the type items
 * in TItemsToRemove removed from the start of the array type.
 *
 * 此类型生成一个 TItems 类型数组，其中从数组类型开头移除了 TItemsToRemove 中的所有类型项。
 *
 * @example
 * ```
 * RemoveItemsInFront<[number, number], [number]> = [number]
 * RemoveItemsInFront<[File, number, string], [File, number]> = [string]
 * ```
 */
// 定义一个类型,从数组类型开头移除指定的类型项
type RemoveItemsInFront<
  TItems extends any[],
  TItemsToRemove extends any[]
> = TItems extends [...TItemsToRemove, ...infer TRest] ? TRest : TItems

// 定义 partial 函数,实现部分应用
export const partial = <T extends any[], TA extends Partial<T>, R>(
  fn: (...args: T) => R, // 原函数
  ...args: TA // 部分参数
) => {
  // 返回一个新函数,接收剩余参数
  return (...rest: RemoveItemsInFront<T, TA>) =>
    fn(...([...args, ...rest] as T))
}

/**
 * Like partial but for unary functions that accept
 * a single object argument
 *
 * 类似于 partial，但用于接受单个对象参数的一元函数
 */
// 定义 partob 函数,实现对象参数的部分应用
export const partob = <T, K, PartialArgs extends Partial<T>>(
  fn: (args: T) => K, // 原函数
  argobj: PartialArgs // 部分对象参数
) => {
  // 返回一个新函数,接收剩余对象参数
  return (restobj: Omit<T, keyof PartialArgs>): K =>
    fn({
      ...(argobj as Partial<T>),
      ...(restobj as Partial<T>)
    } as T)
}

/**
 * Creates a Proxy object that will dynamically
 * call the handler argument when attributes are
 * accessed
 *
 * 创建一个 Proxy 对象，当访问属性时会动态调用处理器参数
 */
// 定义 proxied 函数,创建动态代理对象
export const proxied = <T, K>(
  handler: (propertyName: T) => K // 属性访问处理函数
): Record<string, K> => {
  // 返回一个代理对象
  return new Proxy(
    {},
    {
      get: (target, propertyName: any) => handler(propertyName)
    }
  )
}

// 定义缓存类型
type Cache<T> = Record<string, { exp: number | null; value: T }>

// 定义 memoize 函数,实现函数结果缓存
const memoize = <TArgs extends any[], TResult>(
  cache: Cache<TResult>, // 缓存对象
  func: (...args: TArgs) => TResult, // 原函数
  keyFunc: ((...args: TArgs) => string) | null, // 缓存键生成函数
  ttl: number | null // 缓存过期时间
) => {
  return function callWithMemo(...args: any): TResult {
    // 生成缓存键
    const key = keyFunc ? keyFunc(...args) : JSON.stringify({ args })
    const existing = cache[key]
    // 检查缓存是否存在且未过期
    if (existing !== undefined) {
      if (!existing.exp) return existing.value
      if (existing.exp > new Date().getTime()) {
        return existing.value
      }
    }
    // 执行函数并缓存结果
    const result = func(...args)
    cache[key] = {
      exp: ttl ? new Date().getTime() + ttl : null,
      value: result
    }
    return result
  }
}

/**
 * Creates a memoized function. The returned function
 * will only execute the source function when no value
 * has previously been computed. If a ttl (milliseconds)
 * is given previously computed values will be checked
 * for expiration before being returned.
 *
 * 创建一个记忆化函数。返回的函数仅在没有之前计算过的值时才会执行源函数。
 * 如果提供了 ttl（毫秒），在返回之前会检查之前计算的值是否过期。
 */
// 定义 memo 函数,提供便捷的记忆化函数创建接口
export const memo = <TArgs extends any[], TResult>(
  func: (...args: TArgs) => TResult,
  options: {
    key?: (...args: TArgs) => string
    ttl?: number
  } = {}
) => {
  return memoize({}, func, options.key ?? null, options.ttl ?? null) as (
    ...args: TArgs
  ) => TResult
}

// 定义防抖函数类型
export type DebounceFunction<TArgs extends any[]> = {
  (...args: TArgs): void
  /**
   * Cancels the debounced function
   *
   * 取消防抖函数
   */
  cancel(): void
  /**
   * Checks if there is any invocation debounced
   *
   * 检查是否有任何调用被防抖
   */
  isPending(): boolean
  /**
   * Runs the debounced function immediately
   *
   * 立即运行防抖函数
   */
  flush(...args: TArgs): void
}

// 定义节流函数类型
export type ThrottledFunction<TArgs extends any[]> = {
  (...args: TArgs): void
  /**
   * Checks if there is any invocation throttled
   *
   * 检查是否有任何调用被节流
   */
  isThrottled(): boolean
}

/**
 * Given a delay and a function returns a new function
 * that will only call the source function after delay
 * milliseconds have passed without any invocations.
 *
 * The debounce function comes with a `cancel` method
 * to cancel delayed `func` invocations and a `flush`
 * method to invoke them immediately
 *
 * 给定延迟时间和一个函数，返回一个新函数，该函数仅在经过指定延迟时间且期间没有新的调用时，
 * 才会调用源函数。
 *
 * 防抖函数带有 `cancel` 方法用于取消延迟的函数调用，以及 `flush` 方法用于立即调用它们
 */
// 定义 debounce 函数,实现函数防抖
// 参考ahook实现
export const debounce = <TArgs extends any[]>(
  { delay }: { delay: number }, // 延迟时间
  func: (...args: TArgs) => any // 原函数
) => {
  let timer: NodeJS.Timeout | undefined = undefined
  let active = true

  // 创建防抖函数
  const debounced: DebounceFunction<TArgs> = (...args: TArgs) => {
    if (active) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        active && func(...args)
        timer = undefined
      }, delay)
    } else {
      func(...args)
    }
  }
  // 添加辅助方法
  debounced.isPending = () => {
    return timer !== undefined
  }
  debounced.cancel = () => {
    active = false
  }
  debounced.flush = (...args: TArgs) => func(...args)

  return debounced
}

/**
 * Given an interval and a function returns a new function
 * that will only call the source function if interval milliseconds
 * have passed since the last invocation
 *
 * 给定时间间隔和一个函数，返回一个新函数，该函数仅在距离上次调用超过指定时间间隔后
 * 才会调用源函数
 */
// 定义 throttle 函数,实现函数节流
// 参考ahook实现
export const throttle = <TArgs extends any[]>(
  { interval }: { interval: number }, // 时间间隔
  func: (...args: TArgs) => any // 原函数
) => {
  let ready = true
  let timer: NodeJS.Timeout | undefined = undefined

  // 创建节流函数
  const throttled: ThrottledFunction<TArgs> = (...args: TArgs) => {
    if (!ready) return
    func(...args)
    ready = false
    timer = setTimeout(() => {
      ready = true
      timer = undefined
    }, interval)
  }
  // 添加辅助方法
  throttled.isThrottled = () => {
    return timer !== undefined
  }
  return throttled
}

/**
 * Make an object callable. Given an object and a function
 * the returned object will be a function with all the
 * objects properties.
 *
 * 使对象可调用。给定一个对象和一个函数，返回的对象将是一个函数，
 * 同时具有该对象的所有属性。
 *
 * @example
 * ```typescript
 * const car = callable({
 *   wheels: 2
 * }, self => () => {
 *   return 'driving'
 * })
 *
 * car.wheels // => 2
 * car() // => 'driving'
 * ```
 */
// 定义 callable 函数,使对象可调用
// 文档里没有写，可以去蹭pr
export const callable = <
  TValue,
  TObj extends Record<string | number | symbol, TValue>,
  TFunc extends (...args: any) => any
>(
  obj: TObj, // 原对象
  fn: (self: TObj) => TFunc // 函数生成器
): TObj & TFunc => {
  /* istanbul ignore next */
  const FUNC = () => {}
  // 创建代理对象
  return new Proxy(Object.assign(FUNC, obj), {
    get: (target, key: string) => target[key],
    set: (target, key: string, value: any) => {
      ;(target as any)[key] = value
      return true
    },
    apply: (target, self, args) => fn(Object.assign({}, target))(...args)
  }) as unknown as TObj & TFunc
}
