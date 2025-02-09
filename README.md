# Radash

:loud_sound: `/raw-dash/`

<div align="center">
  <p align="center">
    <img src="https://github.com/rayepps/radash/raw/master/banner.png" alt="radash" width="100%" style="border-radius:4px" />
  </p>
</div>

<div>
  <h3 align="center">
    函数式工具库 - 现代、简单、类型安全、功能强大
  </h3>
</div>

<p align="center">
  <a href="https://bundlephobia.com/package/radash">
    <img src="https://img.shields.io/bundlephobia/minzip/radash?label=minzipped" alt="包大小" height="18">
  </a>
  <a href="https://www.npmjs.com/package/radash">
    <img src="https://img.shields.io/npm/dm/radash.svg" alt="npm 下载量" height="18">
  </a>
  <a href="https://www.npmjs.com/package/radash">
    <img src="https://img.shields.io/npm/v/radash.svg" alt="npm 版本" height="18">
  </a>
  <a href="https://github.com/rayepps/radash">
    <img src="https://img.shields.io/npm/l/radash.svg" alt="MIT 许可证" height="18">
  </a>
</p>

<div align="center">
  <a href="https://radash-docs.vercel.app" target="_blank">
      完整文档
  </a>
</div>


Radash 是一个现代化的工具库，旨在为 lodash 提供一个更加现代的替代方案。它注重可读性和易用性，提供了诸如 tryit 和 retry 等多种实用函数。Radash 最突出的特点之一是，它的大多数函数都可以直接复制到你的项目中使用，无需安装，这使得它对寻求快速解决方案的开发者来说非常方便。

该库在设计时充分考虑了现代 JavaScript 特性，确保充分利用 ES 模块和 TypeScript 支持。这使得 Radash 不仅轻量级，而且与现代开发实践高度兼容。它的函数式编程风格鼓励不可变性和纯函数，这可以带来更清晰、更易维护的代码。

## 安装

```
yarn add radash
```

## 使用方法

以下是一个简要的使用示例。完整文档请查看[这里](https://radash-docs.vercel.app)。

```ts
import * as _ from 'radash'

const gods = [{
  name: 'Ra',
  power: 'sun',
  rank: 100,
  culture: 'egypt'
}, {
  name: 'Loki',
  power: 'tricks',
  rank: 72,
  culture: 'norse'
}, {
  name: 'Zeus',
  power: 'lightning',
  rank: 96,
  culture: 'greek'
}]

_.max(gods, g => g.rank) // => ra
_.sum(gods, g => g.rank) // => 268
_.fork(gods, g => g.culture === 'norse') // => [[loki], [ra, zeus]]
_.sort(gods, g => g.rank) // => [ra, zeus, loki]
_.boil(gods, (a, b) => a.rank > b.rank ? a : b) // => ra

_.objectify(
  gods,
  g => g.name.toLowerCase(),
  g => _.pick(g, ['power', 'rank', 'culture'])
) // => { ra, zeus, loki }

const godName = _.get(gods, g => g[0].name)

const [err, god] = await _.try(api.gods.findByName)(godName)

const allGods = await _.map(gods, async ({ name }) => {
  return api.gods.findByName(name)
})
```

## 贡献

欢迎并感谢您的贡献！在开始之前，请查看[贡献指南](./.github/contributing.md)。
