bin=./node_modules/.bin
# 启动的项目路径
# PATH=./eth/project/fungibleToken
PATH=./eth/project/crowdFund
# PATH=./eth/project/cryptoKitty
# 启动服务的端口号
PORT=30105

$bin/remixd -s $PATH -u https://remix.ethereum.org
