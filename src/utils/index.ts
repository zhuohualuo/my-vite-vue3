import JsEncrypt from 'jsencrypt';
import COS from 'cos-js-sdk-v5';
import { ElMessage } from 'element-plus';
import { stringify } from 'qs';

export function getSite() {
  const reg = /(-sit\d+)/;
  const { domain } = document;
  if (domain === 'net.fcbox.com') {
    return '';
  } else if (reg.test(domain)) {
    // @ts-ignore
    return reg.exec(domain)[0];
  }
  return '-sit6';
}

/**
 * 日期格式化
 */
export function dateFormatter(time: Date, formatStr = 'yyyy-MM-dd hh:mm:ss') {
  const addZero = (number: number) => (number >= 10 ? number : `0${number}`);
  const date = time instanceof Date ? time : new Date(time);
  const year = date.getFullYear().toString();
  const month = addZero(date.getMonth() + 1).toString();
  const day = addZero(date.getDate()).toString();
  const h = addZero(date.getHours()).toString();
  const m = addZero(date.getMinutes()).toString();
  const s = addZero(date.getSeconds()).toString();
  return formatStr.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('hh', h).replace('mm', m).replace('ss', s);
}

export function exportFile({ url, params = {}, method = 'post' }: { url: string; params?: any; method?: string }) {
  const wrap = document.createElement('div');
  let domStr = `<form id='sendAll' action='${url}'  method='${method}' target='_self'>`;
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined) {
      domStr += `<input type='hidden' name='${key}' value='${params[key]}' />`;
    }
  }
  domStr += '</form>';
  wrap.innerHTML = domStr;
  document.body.appendChild(wrap);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.getElementById('sendAll')?.submit();
  document.body.removeChild(wrap);
}

export function downTemplate(templateType: string) {
  exportFile({
    url: '/ops/common/downloadTemplate',
    params: {
      token: localStorage.Authorization,
      templateType
    }
  });
}

/**
 * 分转元
 */

export function toYuan(fen: number | string) {
  if (fen === 0 || fen === '0') return '0';
  if (!fen) return '';
  const yuan = Number((Number(fen) / 100).toFixed(2));
  return yuan;
}

export function toFen(yuan: number) {
  const stringA = yuan.toString();
  const max = (stringA.split('.')[1] || '').length;
  return (Number(stringA.replace('.', '')) * 100) / Math.pow(10, max);
}

export function timeFilter(ms: any, end: any) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  const date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  const h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  const s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  // return y + '-' + m + '-' + date + ' ' + h + ':' + min + ':' + s;
  switch (end) {
    case 'y':
      return y;
    case 'm':
      return y + '-' + m;
    case 'date':
      return y + '-' + m + '-' + date;
    case 'h':
      return y + '-' + m + '-' + date + ' ' + h;
    case 'min':
      return y + '-' + m + '-' + date + ' ' + h + ':' + min;
    case 's':
      return y + '-' + m + '-' + date + ' ' + h + ':' + min + ':' + s;
    default:
      return y + '-' + m + '-' + date + ' ' + h + ':' + min + ':' + s;
  }
}

export const bankArr = [
  { name: '工商银行', id: '700000000000003' },
  { name: '农业银行', id: '700000000000002' },
  { name: '招商银行', id: '700000000000010' },
  { name: '建设银行', id: '700000000000004' },
  { name: '中国银行', id: '700000000000001' },
  { name: '邮政银行', id: '700000000000011' },
  { name: '交通银行', id: '700000000000006' },
  { name: '广发银行', id: '700000000000012' },
  { name: '民生银行', id: '700000000000008' },
  { name: '平安银行', id: '700000000000014' },
  { name: '光大银行', id: '700000000000005' },
  { name: '兴业银行', id: '700000000000009' },
  { name: '中信银行', id: '700000000000013' },
  { name: '上海农商', id: '700000000000023' },
  { name: '浦发银行', id: '700000000000007' },
  { name: '东亚银行', id: '700000000000020' },
  { name: '华夏银行', id: '700000000000015' },
  { name: '杭州银行', id: '700000000000021' },
  { name: '青岛银行', id: '700000000000022' },
  { name: '上海银行', id: '700000000000025' },
  { name: '浙商银行', id: '700000000000038' },
  { name: '徽商银行', id: '700000000000044' }
];

/* rsa加密 */
export const getRSApass = (password: any) => {
  const jse = new JsEncrypt();
  // 公钥
  const publicString = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7EbntGrc7HmrXOP89E8H
    r3nty3q7ZEGkPhrwdpe8lfH4fRXigC4MypISLjAnQPDvVC8X6a2iByyBpQpSeJhv
    vce8c1PAEVz4zjgHpU05zTPJLSHLivk04s/ryQy8z2KneN2vbreH1Y+87LEvhc4y
    AfAtWtD13E8ezUXDVOor4O/0Vzn9H0qwUSljfdB6gCVh2EtNrYstBt1tmfB0m5Dl
    0VwesnO3LayBvQnAYWnx3DvtRzWbFeVjAlZJk3guywAsDzTeLdq+rXLpI2LD6KN/
    oaS+GJRpNHtV2x7Wy0s/U4rWruaBrIpX0mkMwiKP7hrcc70QdczZKI6ZvWWVSqXz
    LQIDAQAB
    -----END PUBLIC KEY-----`;
  jse.setPublicKey(publicString);
  // 加密内容
  const encrypted = jse.encrypt(password);
  return encrypted;
};

/**
 * 创建导出表格
 */

export const createExportFile = (fileRes: any, name: string, time = '') => {
  if (fileRes) {
    const url = window.URL.createObjectURL(new Blob([fileRes]));
    const aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', `${name}${time}.xls`);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(url);
  }
};

/* 倒计时  */

export const format = (d: any) => {
  let m: any = Math.floor(d / 60);
  let s: any = d % 60;
  s = s < 10 ? '0' + s : s;
  m = m < 10 ? '0' + m : m;
  return m + ':' + s;
};

/* cos */
export const uploadQcloudFile = async (tokenObj: any, file: any, callBack: any) => {
  let url = '';
  const cos = new COS({
    getAuthorization: function (options: any, callback: any) {
      console.log({ options });
      callback(tokenObj.sign);
    }
  });
  cos.putObject(
    {
      Bucket: tokenObj.bucket + '-' + tokenObj.appId,
      Region: tokenObj.region,
      Key: tokenObj.filePath + tokenObj.fileName,
      Body: file
    },
    async (err: any, data: any) => {
      if (err || !data || data.statusCode !== 200) {
        ElMessage.error('上传腾讯云出错了~~~');
      } else {
        url = 'http://' + tokenObj.bucket + '-' + tokenObj.appId + '.file.myqcloud.com' + tokenObj.filePath + tokenObj.fileName;
        await callBack(url);
      }
    }
  );
};

// 银联支付
export const payBankResult = (req: any) => {
  if (req.body) {
    const formDiv = document.querySelector('#chinaPay_submit') as any;
    if (formDiv) {
      document.body.removeChild(formDiv.parentNode);
    }
    const oDiv = document.createElement('div');
    oDiv.innerHTML = req.body;
    document.body.appendChild(oDiv);
    setTimeout(() => {
      // @ts-ignore
      document.forms.chinaPay_submit.submit();
    }, 100);
  }
};

// 加载js
export const loadScript = async (url: string) => {
  return new Promise((resolve: any) => {
    const oScript = document.createElement('script');
    oScript.src = url;
    oScript.addEventListener('load', () => {
      resolve();
    });
    document.body.appendChild(oScript);
  });
};

// 新页面打开
export const openPage = (pageName: string, params: any = {}) => {
  const url = `${location.origin}${location.pathname}#${pageName}?${stringify(params)}`;
  window.open(url, '_blank');
};
