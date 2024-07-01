import COS from 'cos-nodejs-sdk-v5'
import { getConfig } from '../config/index.js'
import { CLOUD_TYPE } from './const.js'

const config = getConfig().cos

export const isActive = config.secretId && config.secretKey

const cos = isActive
  ? new COS({
    SecretId: config.secretId,
    SecretKey: config.secretKey
  })
  : null

/**
 * 检查对象是否存在
 * @param {string} key
 */
function tencentHasObject (key) {
  return new Promise((resolve) => {
    cos.headObject({
      Bucket: config.bucket,
      Region: config.region,
      Key: key
    }, (_err, data) => {
      if (data) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export const hasObject = isActive
  ? {
      [CLOUD_TYPE.TENCENT]: tencentHasObject
    }[config.type]
  : () => {}

/**
 * 上传对象
 * @param {string} key
 * @param {Buffer} body
 */
function tencentPutObject (key, body) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: config.bucket,
      Region: config.region,
      Key: key,
      Body: body
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const putObject = isActive
  ? {
      [CLOUD_TYPE.TENCENT]: tencentPutObject
    }[config.type]
  : () => {}

/**
 * 获取对象
 * @param {string} key
 */
function tencentGetObject (key) {
  return new Promise((resolve, reject) => {
    cos.getObject({
      Bucket: config.bucket,
      Region: config.region,
      Key: key
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.Body)
      }
    })
  })
}

export const getObject = isActive
  ? {
      [CLOUD_TYPE.TENCENT]: tencentGetObject
    }[config.type]
  : () => {}

/**
 * 列出对象
 * @param {string} prefix
 * @param {string} [delimiter]
 * @return {Promise<{prefix: string, contents: [{key: string, lastModified: string, eTag: string, size: number}]}>}
 */
function tencentGetBucket (prefix, delimiter) {
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: config.bucket,
      Region: config.region,
      Prefix: prefix,
      Delimiter: delimiter
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          prefix,
          contents: data.Contents.map(e => ({
            key: e.Key,
            lastModified: e.LastModified,
            eTag: e.ETag,
            size: e.Size
          }))
        })
      }
    })
  })
}

export const getBucket = isActive
  ? {
      [CLOUD_TYPE.TENCENT]: tencentGetBucket
    }[config.type]
  : () => {}

/**
 * 删除对象
 * @param {string[]} objects
 */
function tencentDeleteObjects (objects) {
  return new Promise((resolve, reject) => {
    cos.deleteMultipleObject({
      Bucket: config.bucket,
      Region: config.region,
      Objects: objects.map(e => ({ Key: e }))
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const deleteObjects = isActive
  ? {
      [CLOUD_TYPE.TENCENT]: tencentDeleteObjects
    }[config.type]
  : () => {}
