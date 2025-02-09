// npm test -- string.test.ts
/**
 * String manipulation utilities
 * 字符串操作工具
 */

/**
 * Capitalize the first word of the string
 * 将字符串的首字母大写
 *
 * capitalize('hello')   -> 'Hello'
 * capitalize('va va voom') -> 'Va va voom'
 */
export const capitalize = (str: string): string => {
  // Return empty string if input is null/undefined/empty
  // 如果输入为 null/undefined/空字符串，则返回空字符串
  if (!str || str.length === 0) return ''

  // Convert the entire string to lowercase first
  // 先将整个字符串转换为小写
  const lower = str.toLowerCase()

  // Take first character and convert to uppercase, then concatenate with rest of string
  // 将第一个字符转换为大写，然后与剩余字符串拼接
  return lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length)
}

/**
 * Formats the given string in camel case fashion
 * 将字符串转换为驼峰命名
 *
 * camel('hello world')   -> 'helloWorld'
 * camel('va va-VOOM') -> 'vaVaVoom'
 * camel('helloWorld') -> 'helloWorld'
 */
export const camel = (str: string): string => {
  // Optional chaining (?.) operator is used to safely access properties or call methods on potentially null/undefined values
  // If str is null/undefined, the chain will short-circuit and return undefined
  // 可选链操作符 (?.) 用于安全地访问可能为 null/undefined 的值的属性或调用其方法
  // 如果 str 为 null/undefined，则链式调用会中断并返回 undefined

  // Nullish coalescing operator (??) provides a default value [] when the left side is null/undefined
  // 空值合并操作符 (??) 在左侧值为 null/undefined 时提供默认值 []

  // 这里?.和??搭配是非常好的写法。
  const parts =
    str
      ?.replace(/([A-Z])+/g, capitalize)
      ?.split(/(?=[A-Z])|[\.\-\s_]/)
      .map(x => x.toLowerCase()) ?? []

  // Handle edge cases
  // 处理边界情况
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]

  // Combine parts in camelCase format
  // 以驼峰格式组合各部分
  return parts.reduce((acc, part) => {
    return `${acc}${part.charAt(0).toUpperCase()}${part.slice(1)}`
  })
}

/**
 * Formats the given string in snake case fashion
 * 将字符串转换为短横线命名
 *
 * snake('hello world')   -> 'hello_world'
 * snake('va va-VOOM') -> 'va_va_voom'
 * snake('helloWord') -> 'hello_world'
 */
// 要点：同上
export const snake = (
  str: string,
  options?: {
    splitOnNumber?: boolean
  }
): string => {
  // Split string by uppercase letters, dots, hyphens, spaces and underscores
  // 按大写字母、点、连字符、空格和下划线分割字符串
  const parts =
    str
      ?.replace(/([A-Z])+/g, capitalize)
      .split(/(?=[A-Z])|[\.\-\s_]/)
      .map(x => x.toLowerCase()) ?? []

  // Handle edge cases
  // 处理边界情况
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]

  // Combine parts with underscores
  // 用下划线连接各部分
  const result = parts.reduce((acc, part) => {
    return `${acc}_${part.toLowerCase()}`
  })

  // Handle number splitting option
  // 处理数字分割选项
  return options?.splitOnNumber === false
    ? result
    : result.replace(/([A-Za-z]{1}[0-9]{1})/, val => `${val[0]!}_${val[1]!}`)
}

/**
 * Formats the given string in dash case fashion
 * 将字符串转换为短横线命名
 *
 * dash('hello world')   -> 'hello-world'
 * dash('va va_VOOM') -> 'va-va-voom'
 * dash('helloWord') -> 'hello-word'
 */
// 要点：同上
export const dash = (str: string): string => {
  const parts =
    str
      ?.replace(/([A-Z])+/g, capitalize)
      ?.split(/(?=[A-Z])|[\.\-\s_]/)
      .map(x => x.toLowerCase()) ?? []
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return parts.reduce((acc, part) => {
    return `${acc}-${part.toLowerCase()}`
  })
}

/**
 * Formats the given string in pascal case fashion
 * 将字符串转换为帕斯卡命名
 *
 * pascal('hello world') -> 'HelloWorld'
 * pascal('va va boom') -> 'VaVaBoom'
 */
export const pascal = (str: string): string => {
  // Split string by dots, hyphens, spaces and underscores, then convert all parts to lowercase
  // Use optional chaining (?.) and nullish coalescing (??) to handle null/undefined
  // 通过点号、连字符、空格和下划线分割字符串，然后将所有部分转换为小写
  // 使用可选链 (?.) 和空值合并 (??) 来处理 null/undefined 情况
  const parts = str?.split(/[\.\-\s_]/).map(x => x.toLowerCase()) ?? []

  // Return empty string if no parts exist
  // 如果没有分割出任何部分，则返回空字符串
  if (parts.length === 0) return ''

  // For each part:
  // 1. Take the first character and convert to uppercase (charAt(0).toUpperCase())
  // 2. Take the rest of the string (slice(1))
  // 3. Join all parts together with no separator
  // 对每个部分：
  // 1. 取第一个字符并转换为大写 (charAt(0).toUpperCase())
  // 2. 取剩余的字符串 (slice(1))
  // 3. 将所有部分连接在一起，不使用分隔符
  return parts.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('')
}

/**
 * Formats the given string in title case fashion
 * 将字符串转换为标题命名
 *
 * title('hello world') -> 'Hello World'
 * title('va_va_boom') -> 'Va Va Boom'
 * title('root-hook') -> 'Root Hook'
 * title('queryItems') -> 'Query Items'
 */
export const title = (str: string | null | undefined): string => {
  if (!str) return ''
  return str
    .split(/(?=[A-Z])|[\.\-\s_]/)
    .map(s => s.trim())
    .filter(s => !!s)
    .map(s => capitalize(s.toLowerCase()))
    .join(' ')
}

/**
 * template is used to replace data by name in template strings.
 * The default expression looks for {{name}} to identify names.
 *
 * Ex. template('Hello, {{name}}', { name: 'ray' })
 * Ex. template('Hello, <name>', { name: 'ray' }, /<(.+?)>/g)
 */
export const template = (
  str: string,
  data: Record<string, any>,
  regex = /\{\{(.+?)\}\}/g
) => {
  // Replace all matches with corresponding data values
  // 用相应的数据值替换所有匹配项
  // 1. str.matchAll(regex) returns an iterator of all regex matches in the string
  // 2. Array.from() converts the iterator to an array of matches
  // 3. reduce() iterates through each match, replacing template variables with values
  //    - acc: accumulator string that gets updated with each replacement
  //    - match[0]: full match (e.g. "{{name}}")
  //    - match[1]: captured group (e.g. "name") used to lookup value in data object
  // 4. Initial value of reduce is the original string (str)
  // 5. matchAll() returns an iterator of all regex matches in the string
  // 6. Array.from() converts the iterator to an array of matches
  // 7. reduce() iterates through each match, replacing template variables with values
  //    - acc: accumulator string that gets updated with each replacement
  //    - match[0]: full match (e.g. "{{name}}")
  //    - match[1]: captured group (e.g. "name") used to lookup value in data object
  // 8. Initial value of reduce is the original string (str)
  // 此处没有对data字段进行校验，如果data字段不存在，直接报错，小细节处理
  return Array.from(str.matchAll(regex)).reduce((acc, match) => {
    return acc.replace(match[0], data[match[1]])
  }, str)
}

/**
 * Trims all prefix and suffix characters from the given
 * string. Like the builtin trim function but accepts
 * other characters you would like to trim and trims
 * multiple characters.
 *
 * ```typescript
 * trim('  hello ') // => 'hello'
 * trim('__hello__', '_') // => 'hello'
 * trim('/repos/:owner/:repo/', '/') // => 'repos/:owner/:repo'
 * trim('222222__hello__1111111', '12_') // => 'hello'
 * ```
 */
export const trim = (
  str: string | null | undefined,
  charsToTrim: string = ' '
) => {
  // Return empty string for null/undefined input
  // 对于 null/undefined 输入返回空字符串
  if (!str) return ''

  // Escape special characters and create regex pattern
  // 转义特殊字符并创建正则表达式模式
  const toTrim = charsToTrim.replace(/[\W]{1}/g, '\\$&')
  const regex = new RegExp(`^[${toTrim}]+|[${toTrim}]+$`, 'g')

  // Remove matching characters from start and end
  // 从开始和结束处删除匹配的字符
  return str.replace(regex, '')
}
