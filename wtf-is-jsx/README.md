`babel` 在通过 `cli` 进行 `option` 中 `plugins`、 `presets` 配置的时候，一定要保证 `presets` 被安装或者 `preset` 中包含 `plugin`
```
// 一定要保证 @babel/preset-env 被安装
./node_modules/.bin/babel src --out-dir lib --presets=@babel/env
```

@babel/env 会根据浏览器版本进行合适的兼容编译
```
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          // 为了兼容 ie 10，会把箭头函数等都进行编译",
          "ie": "10",
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ]
}
```

@babel/polyfill 是很重的使用方式，会增加包体积，对于工具开发者来说，可以使用 @babel/plugin-transform-runtime
useBuiltIns 会在编译的时候自动引入缺失的功能（与 `corejs` 搭配使用）
```
  "useBuiltIns": "usage",
  "corejs": "3.6.5"
```


// todo
// 插件种类浏览 + 自定义插件
// preset 种类 + 自定义 preset
// babel 7 新特性