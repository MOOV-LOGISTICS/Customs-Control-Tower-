import request from '@/utils/request'

export function aiUploadAndAnalyze(data) {
  return request({
    url: '/system/ai/uploadAndAnalyze',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
    timeout: '30000',
  })
}

export function aiUploadAndAnalyzeHbl(data) {
  return request({
    url: '/system/ai/uploadAndAnalyze-hbl',
    method: "post",
    //Content-Type请求类型必须设置为multipart/form-data
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // 上传文件
    data,
    timeout: '30000',
  })
}