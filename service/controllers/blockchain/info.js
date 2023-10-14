import { getConfig } from '../../config/index.js'

const config = getConfig()

/**
 * @api {get} /blockchain/info 获取区块链信息
 */
export function info (_req, res) {
  res.json({
    config: config.blockchain.public
  })
}
