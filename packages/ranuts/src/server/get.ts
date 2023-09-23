import https from 'node:https';

interface Request {
  url: string;
}

interface Response {
  success: Boolean;
  data: unknown;
  message: string;
}

const get = ({ url }: Request): Promise<Response> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const list: Array<any> = [];
        res.on('data', (chunk) => {
          list.push(chunk);
        });
        res.on('end', () => {
          const { data = [] } = JSON.parse(Buffer.concat(list).toString());
          data.forEach((item: any) => {
            console.log(item);
          });
          resolve({ success: true, data, message: 'request success' });
        });
      })
      .on('error', (err) => {
        console.log('Error: ', err.message);
        reject({ success: false, data: err, message: err.message });
      });
  });
};

export default get;
