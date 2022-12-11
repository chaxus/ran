// code map message
const codes = new Map([
  [100, 'Continue'],
  [101, 'Switching Protocols'],
  [102, 'Processing'],
  [103, 'Early Hints'],
  [200, 'OK'],
  [201, 'Created'],
  [202, 'Accepted'],
  [203, 'Non-Authoritative Information'],
  [204, 'No Content'],
  [205, 'Reset Content'],
  [206, 'Partial Content'],
  [207, 'Multi-Status'],
  [208, 'Already Reported'],
  [226, 'IM Used'],
  [300, 'Multiple Choices'],
  [301, 'Moved Permanently'],
  [302, 'Found'],
  [303, 'See Other'],
  [304, 'Not Modified'],
  [305, 'Use Proxy'],
  [307, 'Temporary Redirect'],
  [308, 'Permanent Redirect'],
  [400, 'Bad Request'],
  [401, 'Unauthorized'],
  [402, 'Payment Required'],
  [403, 'Forbidden'],
  [404, 'Not Found'],
  [405, 'Method Not Allowed'],
  [406, 'Not Acceptable'],
  [407, 'Proxy Authentication Required'],
  [408, 'Request Timeout'],
  [409, 'Conflict'],
  [410, 'Gone'],
  [411, 'Length Required'],
  [412, 'Precondition Failed'],
  [413, 'Payload Too Large'],
  [414, 'URI Too Long'],
  [415, 'Unsupported Media Type'],
  [416, 'Range Not Satisfiable'],
  [417, 'Expectation Failed'],
  [418, "I'm a Teapot"],
  [421, 'Misdirected Request'],
  [422, 'Unprocessable Entity'],
  [423, 'Locked'],
  [424, 'Failed Dependency'],
  [425, 'Too Early'],
  [426, 'Upgrade Required'],
  [428, 'Precondition Required'],
  [429, 'Too Many Requests'],
  [431, 'Request Header Fields Too Large'],
  [451, 'Unavailable For Legal Reasons'],
  [500, 'Internal Server Error'],
  [501, 'Not Implemented'],
  [502, 'Bad Gateway'],
  [503, 'Service Unavailable'],
  [504, 'Gateway Timeout'],
  [505, 'HTTP Version Not Supported'],
  [506, 'Variant Also Negotiates'],
  [507, 'Insufficient Storage'],
  [508, 'Loop Detected'],
  [509, 'Bandwidth Limit Exceeded'],
  [510, 'Not Extended'],
  [511, 'Network Authentication Required'],
])

const status = {
  // status code to message map
  message: codes,
  // status message (lower-case) to code map
  code: createMessageToStatusCodeMap(codes),
  // array of status codes
  codes: createStatusCodeList(codes),
  // status codes for redirects
  redirect: {
    300: true,
    301: true,
    302: true,
    303: true,
    305: true,
    307: true,
    308: true,
  },
  // status codes for empty bodies
  empty: {
    204: true,
    205: true,
    304: true,
  },
  // status codes for when you should retry the request
  retry: {
    502: true,
    503: true,
    504: true,
  },
}

/**
 * @private
 * @description: Create a map of message to status code.
 * @param {Record} codes
 * @param {*} string
 * @return {Record<string, number>}
 */
function createMessageToStatusCodeMap(codes: Map<number, string>) {
  const map: Map<string, number> = new Map()
  for (const [status, message] of codes) {
    map.set(message.toLowerCase(), status)
  }
  return map
}

/**
 * Create a list of all status codes.
 * @private
 */

function createStatusCodeList(codes: Map<number, string>) {
  const codeList: Array<number> = []
  for (const [status, _] of codes) {
    codeList.push(status)
  }
  return codeList
}

/**
 * Get the status code for given message.
 * @private
 */

function getStatusCode(message: string) {
  const msg = message.toLowerCase()
  status.code.has(msg)
  if (!status.code.has(msg)) {
    throw new Error('invalid status message: "' + message + '"')
  }

  return status.code.get(msg)
}

/**
 * Get the status message for given code.
 * @private
 */

function getStatusMessage(code: number) {
  if (!status.message.has(code)) {
    throw new Error('invalid status code: ' + code)
  }

  return status.message.get(code)
}

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */

function getStatus(code?: number | string): number | string | undefined {
  if (typeof code === 'number') {
    // return message
    return getStatusMessage(code)
  }

  if (typeof code !== 'string') {
    throw new TypeError('code must be a number or string')
  }

  // '403'
  const n = parseInt(code, 10)
  if (!isNaN(n) && status.codes.includes(n)) {
    // return message
    return getStatusMessage(n)
  }
  // return code
  return getStatusCode(code)
}

export { status, getStatus }
