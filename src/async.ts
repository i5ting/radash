// 导入数组相关的工具函数
import { fork, list, range, sort } from './array'
// 导入类型判断工具函数
import { isArray, isPromise } from './typed'

/**
 * An async reduce function. Works like the
 * built-in Array.reduce function but handles
 * an async reducer function
 *
 * 一个异步 reduce 函数。功能类似于内置的 Array.reduce 函数，
 * 但可以处理异步的 reducer 函数
 */
// 定义异步 reduce 函数,接收数组、异步 reducer 函数和初始值
export const reduce = async <T, K>(
  array: readonly T[], // 输入数组
  asyncReducer: (acc: K, item: T, index: number) => Promise<K>, // 异步 reducer 函数
  initValue?: K // 可选的初始值
): Promise<K> => {
  // 判断是否提供了初始值
  const initProvided = initValue !== undefined
  // 如果没有初始值且数组为空,抛出错误
  if (!initProvided && array?.length < 1) {
    throw new Error('Cannot reduce empty array with no init value')
  }
  // 根据是否有初始值决定迭代的数组
  const iter = initProvided ? array : array.slice(1)
  // 设置初始累加值
  let value: any = initProvided ? initValue : array[0]
  // 遍历数组并执行异步 reducer
  for (const [i, item] of iter.entries()) {
    value = await asyncReducer(value, item, i)
  }
  // 返回最终结果
  return value
}

/**
 * An async map function. Works like the
 * built-in Array.map function but handles
 * an async mapper function
 *
 * 一个异步 map 函数。功能类似于内置的 Array.map 函数，
 * 但可以处理异步的 mapper 函数
 */
// 定义异步 map 函数,接收数组和异步映射函数
export const map = async <T, K>(
  array: readonly T[], // 输入数组
  asyncMapFunc: (item: T, index: number) => Promise<K> // 异步映射函数
): Promise<K[]> => {
  // 如果数组为空返回空数组
  if (!array) return []
  // 存储结果的数组
  let result = []
  // 当前处理的索引
  let index = 0
  // 遍历数组并执行异步映射
  for (const value of array) {
    const newValue = await asyncMapFunc(value, index++)
    result.push(newValue)
  }
  // 返回映射后的数组
  return result
}

/**
 * Useful when for script like things where cleanup
 * should be done on fail or sucess no matter.
 *
 * You can call defer many times to register many
 * defered functions that will all be called when
 * the function exits in any state.
 *
 * 适用于脚本类的场景，无论成功或失败都需要进行清理工作。
 *
 * 你可以多次调用 defer 来注册多个延迟函数，这些函数会在
 * 主函数以任何状态退出时被调用。
 */
// 定义延迟执行函数,用于注册清理函数
export const defer = async <TResponse>(
  func: (
    register: (
      fn: (error?: any) => any,
      options?: { rethrow?: boolean }
    ) => void
  ) => Promise<TResponse>
): Promise<TResponse> => {
  // 存储回调函数的数组
  const callbacks: {
    fn: (error?: any) => any
    rethrow: boolean
  }[] = []
  // 注册回调函数的方法
  const register = (
    fn: (error?: any) => any,
    options?: { rethrow?: boolean }
  ) =>
    callbacks.push({
      fn,
      rethrow: options?.rethrow ?? false
    })
  // 执行主函数并捕获可能的错误
  const [err, response] = await tryit(func)(register)
  // 执行所有注册的回调函数
  for (const { fn, rethrow } of callbacks) {
    const [rethrown] = await tryit(fn)(err)
    if (rethrown && rethrow) throw rethrown
  }
  // 如果有错误则抛出
  if (err) throw err
  // 返回执行结果
  return response
}

// 定义工作项结果的类型
type WorkItemResult<K> = {
  index: number
  result: K
  error: any
}

/**
 * Support for the built-in AggregateError
 * is still new. Node < 15 doesn't have it
 * so patching here.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError#browser_compatibility
 *
 * 对内置 AggregateError 的支持还比较新。
 * Node < 15 版本没有这个功能，所以在这里进行补丁处理。
 */
// 定义聚合错误类
export class AggregateError extends Error {
  errors: Error[]
  constructor(errors: Error[] = []) {
    super()
    // 设置错误名称
    const name = errors.find(e => e.name)?.name ?? ''
    this.name = `AggregateError(${name}...)`
    // 设置错误消息
    this.message = `AggregateError with ${errors.length} errors`
    // 设置错误堆栈
    this.stack = errors.find(e => e.stack)?.stack ?? this.stack
    // 存储所有错误
    this.errors = errors
  }
}

/**
 * Executes many async functions in parallel. Returns the
 * results from all functions as an array. After all functions
 * have resolved, if any errors were thrown, they are rethrown
 * in an instance of AggregateError
 *
 * 并行执行多个异步函数。以数组形式返回所有函数的结果。
 * 当所有函数都解析完成后，如果有任何错误被抛出，
 * 这些错误会被重新包装在一个 AggregateError 实例中抛出
 */
// 定义并行执行函数
export const parallel = async <T, K>(
  limit: number, // 并发限制
  array: readonly T[], // 输入数组
  func: (item: T) => Promise<K> // 异步处理函数
): Promise<K[]> => {
  // 将数组项转换为工作项
  const work = array.map((item, index) => ({
    index,
    item
  }))
  // 处理数组项的函数
  const processor = async (res: (value: WorkItemResult<K>[]) => void) => {
    const results: WorkItemResult<K>[] = []
    while (true) {
      const next = work.pop()
      if (!next) return res(results)
      const [error, result] = await tryit(func)(next.item)
      results.push({
        error,
        result: result as K,
        index: next.index
      })
    }
  }
  // 创建工作队列
  const queues = list(1, limit).map(() => new Promise(processor))
  // 等待所有队列完成
  const itemResults = (await Promise.all(queues)) as WorkItemResult<K>[][]
  // 分离错误和结果
  const [errors, results] = fork(
    sort(itemResults.flat(), r => r.index),
    x => !!x.error
  )
  // 如果有错误则抛出聚合错误
  if (errors.length > 0) {
    throw new AggregateError(errors.map(error => error.error))
  }
  // 返回所有结果
  return results.map(r => r.result)
}

// 定义 Promise 值的类型
type PromiseValues<T extends Promise<any>[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : never
}

/**
 * Functionally similar to Promise.all or Promise.allSettled. If any
 * errors are thrown, all errors are gathered and thrown in an
 * AggregateError.
 *
 * @example
 * const [user] = await all([
 *   api.users.create(...),
 *   s3.buckets.create(...),
 *   slack.customerSuccessChannel.sendMessage(...)
 * ])
 *
 * 功能类似于 Promise.all 或 Promise.allSettled。
 * 如果有任何错误被抛出，所有错误都会被收集并包装在
 * AggregateError 中抛出。
 */
// 定义 all 函数的数组重载
export async function all<T extends [Promise<any>, ...Promise<any>[]]>(
  promises: T
): Promise<PromiseValues<T>>
export async function all<T extends Promise<any>[]>(
  promises: T
): Promise<PromiseValues<T>>
/**
 * Functionally similar to Promise.all or Promise.allSettled. If any
 * errors are thrown, all errors are gathered and thrown in an
 * AggregateError.
 *
 * @example
 * const { user } = await all({
 *   user: api.users.create(...),
 *   bucket: s3.buckets.create(...),
 *   message: slack.customerSuccessChannel.sendMessage(...)
 * })
 */
// 定义 all 函数的对象重载
export async function all<T extends Record<string, Promise<any>>>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }>
// all 函数的具体实现
export async function all<
  T extends Record<string, Promise<any>> | Promise<any>[]
>(promises: T) {
  // 将输入转换为统一格式
  const entries = isArray(promises)
    ? promises.map(p => [null, p] as [null, Promise<any>])
    : Object.entries(promises)

  // 并行执行所有 Promise
  const results = await Promise.all(
    entries.map(([key, value]) =>
      value
        .then(result => ({ result, exc: null, key }))
        .catch(exc => ({ result: null, exc, key }))
    )
  )

  // 检查是否有错误
  const exceptions = results.filter(r => r.exc)
  if (exceptions.length > 0) {
    throw new AggregateError(exceptions.map(e => e.exc))
  }

  // 根据输入类型返回相应格式的结果
  if (isArray(promises)) {
    return results.map(r => r.result) as T extends Promise<any>[]
      ? PromiseValues<T>
      : unknown
  }

  return results.reduce(
    (acc, item) => ({
      ...acc,
      [item.key!]: item.result
    }),
    {} as { [K in keyof T]: Awaited<T[K]> }
  )
}

/**
 * Retries the given function the specified number
 * of times.
 *
 * 重试指定函数指定的次数。
 */
// 定义重试函数
export const retry = async <TResponse>(
  options: {
    times?: number // 重试次数
    delay?: number | null // 延迟时间
    backoff?: (count: number) => number // 退避策略
  },
  func: (exit: (err: any) => void) => Promise<TResponse>
): Promise<TResponse> => {
  // 设置默认值
  const times = options?.times ?? 3
  const delay = options?.delay
  const backoff = options?.backoff ?? null
  // 进行重试
  for (const i of range(1, times)) {
    const [err, result] = (await tryit(func)((err: any) => {
      throw { _exited: err }
    })) as [any, TResponse]
    if (!err) return result
    if (err._exited) throw err._exited
    if (i === times) throw err
    if (delay) await sleep(delay)
    if (backoff) await sleep(backoff(i))
  }
  // 逻辑上永远不会到达这里
  /* istanbul ignore next */
  return undefined as unknown as TResponse
}

/**
 * Async wait
 *
 * 异步等待
 */
// 定义睡眠函数
export const sleep = (milliseconds: number) => {
  return new Promise(res => setTimeout(res, milliseconds))
}

/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 *
 * 一个帮助函数，用于尝试执行异步函数而不分叉控制流。
 * 返回一个类似错误优先回调的数组响应，格式为 [Error, result]
 */
// 定义 tryit 函数
export const tryit = <Args extends any[], Return>(
  func: (...args: Args) => Return
) => {
  return (
    ...args: Args
  ): Return extends Promise<any>
    ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
    : [Error, undefined] | [undefined, Return] => {
    try {
      // 执行函数
      const result = func(...args)
      // 处理异步结果
      if (isPromise(result)) {
        return result
          .then(value => [undefined, value])
          .catch(err => [err, undefined]) as Return extends Promise<any>
          ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
          : [Error, undefined] | [undefined, Return]
      }
      // 处理同步结果
      return [undefined, result] as Return extends Promise<any>
        ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
        : [Error, undefined] | [undefined, Return]
    } catch (err) {
      // 处理错误
      return [err as any, undefined] as Return extends Promise<any>
        ? Promise<[Error, undefined] | [undefined, Awaited<Return>]>
        : [Error, undefined] | [undefined, Return]
    }
  }
}

/**
 * A helper to try an async function that returns undefined
 * if it fails.
 *
 * e.g. const result = await guard(fetchUsers)() ?? [];
 *
 * 一个帮助函数，用于尝试执行异步函数，如果失败则返回 undefined。
 *
 * 例如：const result = await guard(fetchUsers)() ?? [];
 */
// 定义 guard 函数
export const guard = <TFunction extends () => any>(
  func: TFunction,
  shouldGuard?: (err: any) => boolean
): ReturnType<TFunction> extends Promise<any>
  ? Promise<Awaited<ReturnType<TFunction>> | undefined>
  : ReturnType<TFunction> | undefined => {
  // 定义错误处理函数
  const _guard = (err: any) => {
    if (shouldGuard && !shouldGuard(err)) throw err
    return undefined as any
  }
  // 判断是否为 Promise
  const isPromise = (result: any): result is Promise<any> =>
    result instanceof Promise
  try {
    // 执行函数
    const result = func()
    return isPromise(result) ? result.catch(_guard) : result
  } catch (err) {
    // 处理错误
    return _guard(err)
  }
}

/**
 * Async operation utilities
 * 异步操作工具
 */

/**
 * Delay execution for specified milliseconds
 * 延迟指定毫秒数的执行
 */

/**
 * Retry async function with specified attempts
 * 使用指定的尝试次数重试异步函数
 */

// Utility functions for handling asynchronous operations
// 用于处理异步操作的工具函数
