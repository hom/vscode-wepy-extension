<p>
  <h1 align="center">Wepy</h1>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=mengj.wepy">
    <img src="https://vsmarketplacebadge.apphb.com/version-short/mengj.wepy.svg?style=flat-square">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mengj.wepy">
    <img src="https://vsmarketplacebadge.apphb.com/installs-short/mengj.wepy.svg?style=flat-square">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mengj.wepy">
    <img src="https://vsmarketplacebadge.apphb.com/rating-short/mengj.wepy.svg?style=flat-square">
  </a>
</p>

Wepy tooling for VS Code, powered by [Vetur](https://github.com/vuejs/vetur).

## Features

- Syntax-highlighting
- Snippet
- Emmet
- Linting / Error Checking
- Formatting
- Auto Completion
- Debugging

## Add

- `config` and `wxs` block syntax-highlighting
- `config` block highlighting with `json` style
- `wxs` block highlighting with `javascript` style
- add `template` and `style` emmet

## Usage

### Enable and disable

If there are some warning alerts when you use both `Vetur` and `Wepy` extension, you may need to disable `Vetur` extension to make sure the `Wepy` highlight normally

The `Vetur` extension is already disabled, you can see [example](https://i.loli.net/2020/09/21/xDlMioeFmEI4UJs.png)

And enable the `Wepy`, see [it](https://i.loli.net/2020/09/21/LBrkFJXyRO5PK96.png)

### Create a wepy file quickly

When you create a new wepy file with filename and `.wpy` suffix, you can type `vue` to generate wepy file template quickly, and type `enter` to select default template, the example is [here](https://i.loli.net/2020/09/21/LkF4AHN8QK7C1uR.png) and [another one](https://i.loli.net/2020/09/21/bx1qyLSNK4hFGCQ.png)

### Create file block quickly
  - type `config` to create `<config></config>` block quickly with `json` format
  - type `wxs` to create `<wxs module=""></wxs>` block quickly with `javascript` format
  - type `script` to create `<script></script>` block quickly with `javascript` format

## TODO

> There are also some bugs and unsupport attributes, and I will support soon.

## Power thanks

- [Vetur](https://github.com/vuejs/vetur)

## License

MIT © [hom](https://github.com/hom) 

