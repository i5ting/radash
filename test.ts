// 写一个assign的测试函数
import { assign } from './src/object'

interface God {
  name: string
  power: number
}

const ra: God = {
  name: 'Ra',
  power: 100
}

const child: Partial<God> = { name: 'Loki', power: ra.power }

// 使用类型断言确保更新对象包含所有必需属性
const obj: Partial<God> = assign(ra, child)

// console.log(obj)

//
// Array.reduce() example
const numbers = [1, 2, 3, 4, 5]

// Calculate sum using reduce
const sum = numbers.reduce((accumulator, currentValue) => {
  console.log(`Accumulator: ${accumulator}, Current Value: ${currentValue}`)
  return accumulator + currentValue
}, 0) // 0 is initial value

console.log('Final sum:', sum) // Output: 15
