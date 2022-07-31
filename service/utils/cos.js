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
 * 列出对象
 * @param {string} prefix
 * @param {string} [delimiter]
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
