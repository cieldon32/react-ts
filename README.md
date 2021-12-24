源代码在react-master上， 在该仓库里将flow转换成ts，并复制到react项目中， 再删除掉js文件， 命令行如下：
yarn global add @khanacademy/flow-to-ts
flow-to-ts /Users/xiayun/github/react/packages/shared/forks/*  --write
find packages/shared/fork -name "*.js" | xargs rm