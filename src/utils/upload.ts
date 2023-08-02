// 上传图片到腾讯云
import http from '@/utils12/http';
import COS from 'cos-js-sdk-v5';
import { ElMessage } from 'element-plus';

interface TokenParams {
  type: number;
  file: any;
}

export const getUploadFileToken = async ({ type, file }: TokenParams) => {
  const tokenObj = await http.request({
    data: {
      type,
      fileName: file.name
    },
    url: '/ops/common/getUploadFileToken',
    method: 'POST'
  });
  const cos = new COS({
    getAuthorization: function (options: any, callback: any) {
      callback(tokenObj.sign);
    }
  });
  const url = await new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: tokenObj.bucket + '-' + tokenObj.appId,
        Region: tokenObj.region,
        Key: tokenObj.filePath + tokenObj.fileName,
        Body: file.raw
      },
      (err: any, data: any) => {
        if (err || !data || data.statusCode !== 200) {
          ElMessage.error('上传出错，请重新操作');
          reject('');
        } else {
          resolve('http://' + tokenObj.bucket + '-' + tokenObj.appId + '.file.myqcloud.com' + tokenObj.filePath + tokenObj.fileName);
        }
      }
    );
  });
  return url;
};
