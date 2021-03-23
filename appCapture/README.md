#关于截图的使用

截图保存了某个开发时刻的app的快照

可以通过截图快速找到相关提交，定位相关代码

截图的名称以[57038c9a.png]为例

57038c9a是当前截图的前一个commit 的hash值
```
假设git log如下
* 011cf06 (HEAD -> master) prototype of homepage by different color div box with different color
* 57038c9 (origin/master) update electron to ^11.3.0 to fix the bug of react dev tool
* f9d487b first commit about the project
* cd152f6 change default process.env.PORT
* badefe4 init project from electron-react-boilerplate

```

如果你想看57038c9a.png的代码

就回退到57038c9a下一次提交即可

既 011cf06
