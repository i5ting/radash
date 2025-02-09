import { objectify } from './array' // 从 array 模块导入 objectify 函数
import { toInt } from './number' // 从 number 模块导入 toInt 函数
import { isArray, isObject, isPrimitive } from './typed' // 从 typed 模块导入类型判断函数

// Array.reduce方法参数实例
// Array.reduce() method parameters example from MDN:
// array.reduce(function(accumulator, currentValue, currentIndex, array) { ... }, initialValue)
// Example:
// [0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array) {
//   return accumulator + currentValue;
// }, 0);
// accumulator: The value resulting from the previous call to callbackFn
// currentValue: The current element being processed in the array
// currentIndex: The index of the current element being processed
// array: The array reduce() was called upon
// initialValue: A value to use as the first argument to the first call of callbackFn

type UppercasedKeys<T extends Record<string, any>> = {
  // 定义将对象键转为大写的类型
  [P in keyof T & string as Uppercase<P>]: T[P]
}

/**
 * 对象操作工具集
 */

/**
 * 从对象中移除未定义的条目。
 * 可选的第二个参数可以通过自定义评估来移除值。
 */
export const shake = <RemovedKeys extends string, T>( // 从对象中移除未定义的属性
  obj: T, // 输入对象
  filter: (value: any) => boolean = x => x === undefined // 过滤函数,默认移除 undefined
): Omit<T, RemovedKeys> => {
  if (!obj) return {} as T // 如果对象为空,返回空对象
  const keys = Object.keys(obj) as (keyof T)[] // 获取对象所有键
  return keys.reduce((acc, key) => {
    // 使用 reduce 构建新对象
    if (filter(obj[key])) {
      // 如果值被过滤
      return acc // 跳过该属性
    } else {
      acc[key] = obj[key] // 保留该属性
      return acc
    }
  }, {} as T)
}

/**
 * 遍历对象的所有键以返回一个新对象
 */
export const mapKeys = <
  // 映射对象的键
  TValue, // 值类型
  TKey extends string | number | symbol, // 键类型
  TNewKey extends string | number | symbol // 新键类型
>(
  obj: Record<TKey, TValue>, // 输入对象
  mapFunc: (key: TKey, value: TValue) => TNewKey // 键映射函数
): Record<TNewKey, TValue> => {
  const keys = Object.keys(obj) as TKey[] // 获取所有键
  return keys.reduce((acc, key) => {
    // 使用 reduce 构建新对象
    acc[mapFunc(key as TKey, obj[key])] = obj[key] // 使用映射后的键
    return acc
  }, {} as Record<TNewKey, TValue>)
}

/**
 * 遍历所有键以创建一个新对象
 */
export const mapValues = <
  // 映射对象的值
  TValue, // 原值类型
  TKey extends string | number | symbol, // 键类型
  TNewValue // 新值类型
>(
  obj: Record<TKey, TValue>, // 输入对象
  mapFunc: (value: TValue, key: TKey) => TNewValue // 值映射函数
): Record<TKey, TNewValue> => {
  const keys = Object.keys(obj) as TKey[] // 获取所有键
  return keys.reduce((acc, key) => {
    // 使用 reduce 构建新对象
    acc[key] = mapFunc(obj[key], key) // 映射值
    return acc
  }, {} as Record<TKey, TNewValue>)
}

/**
 * 遍历所有键以创建一个新对象
 */
export const mapEntries = <
  // 同时映射对象的键和值
  TKey extends string | number | symbol, // 原键类型
  TValue, // 原值类型
  TNewKey extends string | number | symbol, // 新键类型
  TNewValue // 新值类型
>(
  obj: Record<TKey, TValue>, // 输入对象
  toEntry: (key: TKey, value: TValue) => [TNewKey, TNewValue] // 条目映射函数
): Record<TNewKey, TNewValue> => {
  if (!obj) return {} as Record<TNewKey, TNewValue> // 如果对象为空返回空对象
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // 使用 reduce 构建新对象
    const [newKey, newValue] = toEntry(key as TKey, value as TValue) // 映射键值对
    acc[newKey] = newValue // 设置新的键值对
    return acc
  }, {} as Record<TNewKey, TNewValue>)
}

/**
 * 返回一个对象，其中 { [键]: 值 }
 * 被转换为 { [值]: 键 }
 */
export const invert = <
  // 反转对象的键和值
  TKey extends string | number | symbol, // 键类型
  TValue extends string | number | symbol // 值类型
>(
  obj: Record<TKey, TValue> // 输入对象
): Record<TValue, TKey> => {
  if (!obj) return {} as Record<TValue, TKey> // 如果对象为空返回空对象
  const keys = Object.keys(obj) as TKey[] // 获取所有键
  return keys.reduce((acc, key) => {
    // 使用 reduce 构建新对象
    acc[obj[key]] = key // 反转键值对
    return acc
  }, {} as Record<TValue, TKey>)
}

/**
 * 将对象中的所有键转换为小写
 */
export const lowerize = <T extends Record<string, any>>(
  obj: T // 将对象的键转为小写
) => mapKeys(obj, k => k.toLowerCase()) as LowercasedKeys<T>

/**
 * 将对象中的所有键转换为大写
 */
export const upperize = <T extends Record<string, any>>(
  obj: T // 将对象的键转为大写
) => mapKeys(obj, k => k.toUpperCase()) as UppercasedKeys<T>

/**
 * 创建给定对象/值的浅拷贝。
 * @param {*} obj 要克隆的值
 * @returns {*} 给定值的浅拷贝
 * 注意：这是浅克隆，不是深克隆
 */
export const clone = <T>(obj: T): T => {
  // 创建对象的浅拷贝
  // Primitive values do not need cloning.
  if (isPrimitive(obj)) {
    // 如果是原始类型直接返回
    return obj
  }

  // Binding a function to an empty object creates a
  // copy function.
  if (typeof obj === 'function') {
    // 如果是函数则绑定到空对象
    return obj.bind({})
  }

  // Access the constructor and create a new object.
  // This method can create an array as well.
  const newObj = new ((obj as object).constructor as { new (): T })() // 使用构造函数创建新对象

  // Assign the props.
  Object.getOwnPropertyNames(obj).forEach(prop => {
    // 遍历所有属性
    // Bypass type checking since the primitive cases
    // are already checked in the beginning
    ;(newObj as any)[prop] = (obj as any)[prop] // 复制属性值
  })

  return newObj
}

/**
 * 将对象转换为列表，将每个条目
 * 映射为列表项
 */
export const listify = <TValue, TKey extends string | number | symbol, KResult>( // 将对象转换为列表
  obj: Record<TKey, TValue>, // 输入对象
  toItem: (key: TKey, value: TValue) => KResult // 条目转换函数
) => {
  if (!obj) return [] // 如果对象为空返回空数组
  const entries = Object.entries(obj) // 获取所有条目
  if (entries.length === 0) return [] // 如果没有条目返回空数组
  return entries.reduce((acc, entry) => {
    // 使用 reduce 构建数组
    acc.push(toItem(entry[0] as TKey, entry[1] as TValue)) // 转换并添加条目
    return acc
  }, [] as KResult[])
}

/**
 * 从对象中选择一系列属性
 * 到新对象中
 */
export const pick = <T extends object, TKeys extends keyof T>( // 从对象中选择指定属性
  obj: T, // 输入对象
  keys: TKeys[] // 要选择的键数组
): Pick<T, TKeys> => {
  if (!obj) return {} as Pick<T, TKeys> // 如果对象为空返回空对象
  return keys.reduce((acc, key) => {
    // 使用 reduce 构建新对象
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key] // 如果属性存在则复制
    return acc
  }, {} as Pick<T, TKeys>)
}

/**
 * 从对象中省略一系列属性
 * 返回一个包含剩余属性的新对象
 */
export const omit = <T, TKeys extends keyof T>( // 从对象中排除指定属性
  obj: T, // 输入对象
  keys: TKeys[] // 要排除的键数组
): Omit<T, TKeys> => {
  if (!obj) return {} as Omit<T, TKeys> // 如果对象为空返回空对象
  if (!keys || keys.length === 0) return obj as Omit<T, TKeys> // 如果没有要排除的键返回原对象
  return keys.reduce(
    (acc, key) => {
      // Gross, I know, it's mutating the object, but we
      // are allowing it in this very limited scope due
      // to the performance implications of an omit func.
      // Not a pattern or practice to use elsewhere.
      delete acc[key] // 删除指定的键
      return acc
    },
    { ...obj } // 复制原对象
  )
}

/**
 * 使用字符串动态获取数组或对象中的
 * 嵌套值。
 *
 * @example get(person, 'friends[0].name')
 */
export const get = <TDefault = unknown>( // 根据路径获取嵌套值
  value: any, // 输入值
  path: string, // 路径字符串
  defaultValue?: TDefault // 默认值
): TDefault => {
  const segments = path.split(/[\.\[\]]/g) // 分割路径
  let current: any = value // 当前值
  // 此处是要点
  for (const key of segments) {
    // 遍历路径段
    if (current === null) return defaultValue as TDefault // 如果当前值为 null 返回默认值
    if (current === undefined) return defaultValue as TDefault // 如果当前值为 undefined 返回默认值
    const dequoted = key.replace(/['"]/g, '') // 移除引号
    if (dequoted.trim() === '') continue // 跳过空路径段
    current = current[dequoted] // 获取下一层值
  }
  if (current === undefined) return defaultValue as TDefault // 如果最终值为 undefined 返回默认值
  return current
}

/**
 * get 的反向操作，使用键路径动态地将嵌套值
 * 设置到对象中。不会修改给定的初始对象。
 *
 * @example
 * set({}, 'name', 'ra') // => { name: 'ra' }
 * set({}, 'cards[0].value', 2) // => { cards: [{ value: 2 }] }
 */
export const set = <T extends object, K>( // 根据路径设置嵌套值
  initial: T, // 初始对象
  path: string, // 路径字符串
  value: K // 要设置的值
): T => {
  if (!initial) return {} as T // 如果初始对象为空返回空对象
  if (!path || value === undefined) return initial // 如果路径为空或值为 undefined 返回初始对象
  const segments = path.split(/[\.\[\]]/g).filter(x => !!x.trim()) // 分割并过滤路径
  const _set = (node: any) => {
    // 递归设置值的函数
    if (segments.length > 1) {
      // 如果还有更多路径段
      const key = segments.shift() as string // 获取当前路径段
      const nextIsNum = toInt(segments[0], null) === null ? false : true // 判断下一段是否为数字
      node[key] = node[key] === undefined ? (nextIsNum ? [] : {}) : node[key] // 初始化当前节点
      _set(node[key]) // 递归设置下一层
    } else {
      node[segments[0]] = value // 设置最终值
    }
  }
  // NOTE: One day, when structuredClone has more
  // compatability use it to clone the value
  // https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
  const cloned = clone(initial) // 克隆初始对象
  _set(cloned) // 设置值
  return cloned
}

/**
 * 递归地将两个对象合并成一个新对象，从右到左应用值。
 * 递归仅应用于子对象属性。
 */
export const assign = <X extends Record<string | symbol | number, any>>( // 递归合并对象
  initial: X, // 初始对象
  override: X // 覆盖对象
): X => {
  if (!initial || !override) return initial ?? override ?? {} // 处理空值情况

  return Object.entries({ ...initial, ...override }).reduce(
    // 使用 reduce 构建新对象
    (acc, [key, value]) => {
      return {
        ...acc,
        [key]: (() => {
          if (isObject(initial[key])) return assign(initial[key], value) // 递归合并对象
          // if (isArray(value)) return value.map(x => assign)
          return value // 返回普通值
        })()
      }
    },
    {} as X
  )
}

/**
 * 获取对象中存在的所有键名的字符串列表（深度遍历）。
 *
 * @example
 * keys({ name: 'ra' }) // ['name']
 * keys({ name: 'ra', children: [{ name: 'hathor' }] }) // ['name', 'children.0.name']
 */
export const keys = <TValue extends object>(value: TValue): string[] => {
  // 获取对象所有键的路径
  if (!value) return [] // 如果值为空返回空数组
  const getKeys = (nested: any, paths: string[]): string[] => {
    // 递归获取键的函数
    if (isObject(nested)) {
      // 如果是对象
      return Object.entries(nested).flatMap(
        (
          [k, v] // 遍历所有条目
        ) => getKeys(v, [...paths, k]) // 递归获取子属性的键
      )
    }
    if (isArray(nested)) {
      // 如果是数组
      return nested.flatMap((item, i) => getKeys(item, [...paths, `${i}`])) // 递归获取数组元素的键
    }
    return [paths.join('.')] // 返回键路径
  }
  return getKeys(value, [])
}

/**
 * 将深层对象扁平化为单一维度，将键转换为点号表示法。
 *
 * 为啥不用flat呢？
 *
 * @example
 * crush({ name: 'ra', children: [{ name: 'hathor' }] })
 * // { name: 'ra', 'children.0.name': 'hathor' }
 */
export const crush = <TValue extends object>(value: TValue): object => {
  // 将嵌套对象扁平化
  if (!value) return {} // 如果值为空返回空对象
  return objectify(
    // 构建扁平对象
    keys(value), // 获取所有键路径
    k => k, // 键保持不变
    k => get(value, k) // 获取对应的值
  )
}

/**
 * crush 的反向操作，给定一个被压缩成键路径和值的对象，
 * 将返回重构的原始对象。
 *
 * @example
 * construct({ name: 'ra', 'children.0.name': 'hathor' })
 * // { name: 'ra', children: [{ name: 'hathor' }] }
 */
export const construct = <TObject extends object>(obj: TObject): object => {
  // 重构扁平对象为嵌套对象
  if (!obj) return {} // 如果对象为空返回空对象
  return Object.keys(obj).reduce((acc, path) => {
    // 使用 reduce 构建嵌套对象
    return set(acc, path, (obj as any)[path]) // 根据路径设置值
  }, {})
}

/**
 * 深度克隆一个对象
 */

/**
 * 深度合并对象
 */

/**
 * 从对象中选取指定的属性
 */
