import * as d3 from 'd3'
import processPptx from '@/utils/pptx/process_pptx'
import dimple from '@/utils/dimple'

type ChartData = Array<{
  key: string
  xlabels: string[]
  values: Array<{ y: number }>
  length: number
  [x: string]: any
}>

interface Charts {
  chartID: string
  chartType: string
  chartData: ChartData
}

export interface Msg<T = string> {
  type: string
  data: T extends 'slide' | 'pptx-thumb' | 'globalCSS' ? string : any
}

interface Options {
  pptx: ArrayBuffer | string
  resultElement: HTMLElement
  thumbElement?: HTMLElement
}

interface Worker {
  postMessage: (x: Msg) => void
  // terminate: () => void
}

const newSvg = (parentSelector: string, width: string, height: string) => {
  if (parentSelector == null || parentSelector === undefined) {
    parentSelector = 'body'
  }
  const selectedShape = d3.select(parentSelector)
  if (selectedShape.empty()) {
    throw (
      "The '" +
      parentSelector +
      "' selector did not match any elements.  Please prefix with '#' to select by id or '.' to select by class"
    )
  }
  return selectedShape.append('svg').attr('width', width).attr('height', height)
}

/**
 * @param {ArrayBuffer} pptx
 * @param {Element|String} resultElement
 * @param {Element|String} [thumbElement]
 */
export const renderPptx = (options: Options): Promise<any> | undefined => {
  if (typeof window !== 'undefined') {
    const { pptx, resultElement, thumbElement } = options
    const wrapper = document.createElement('div')
    wrapper.setAttribute('class', 'pptx-wrapper')
    resultElement.innerHTML = ''
    resultElement.appendChild(wrapper)
    let isDone = false
    return new Promise((resolve, reject) => {
      const processMessage = (msg: Msg) => {
        if (isDone) return
        const div = document.createElement('div')
        const style = document.createElement('style')
        switch (msg.type) {
          case 'slide':
            div.innerHTML = msg.data
            wrapper.appendChild(div)
            break
          case 'pptx-thumb':
            if (thumbElement)
              thumbElement?.setAttribute(
                'src',
                `data:image/jpeg;base64,${msg.data}`,
              )
            break
          case 'slideSize':
            break
          case 'globalCSS':
            style.innerHTML = msg.data
            wrapper.appendChild(style)
            break
          case 'Done':
            isDone = true
            processCharts(msg.data.charts)
            resolve(msg.data.time)
            break
          case 'WARN':
            console.warn('PPTX processing warning: ', msg.data)
            break
          case 'ERROR':
            isDone = true
            console.error('PPTX processing error: ', msg.data)
            reject(new Error(msg.data))
            break
          case 'DEBUG':
            // console.debug('Worker: ', msg.data)
            break
          case 'INFO':
          default:
          // console.info('Worker: ', msg.data)
        }
      }
      const worker: Worker = {
        postMessage,
        // terminate,
      }
      processPptx((func: (x: Msg) => void) => {
        worker.postMessage = func
      }, processMessage)
      // 执行postMessage方法
      worker.postMessage({
        type: 'processPPTX',
        data: pptx,
      })
    }).then((time) => {
      const resize = () => {
        const slidesWidth = Math.max(
          ...Array.from(wrapper.children)
            .filter((item) => item.nodeName === 'section')
            .map((s) => (s as HTMLElement).offsetWidth),
        )
        const wrapperWidth = (wrapper.children[0] as HTMLElement).offsetWidth
        wrapper.setAttribute(
          'style',
          `transform: scale(${
            wrapperWidth / slidesWidth
          }),transform-origin': 'top left'`,
        )
      }
      resize()
      window.addEventListener('resize', resize)
      setNumericBullets(document.getElementsByClassName('block'))
      setNumericBullets(document.getElementsByTagName('td'))
      return time
    })
  }

  function processCharts(queue: string | any[]) {
    for (let i = 0; i < queue.length; i++) {
      processSingleChart(queue[i].data)
    }
  }

  function convertChartData(chartData: ChartData) {
    const data: Array<{ name: string; group: string; value: number }> = []
    const xLabels: Array<string> = []
    const groupLabels: Array<string> = []
    chartData.forEach((group, i) => {
      const groupName = group.key
      groupLabels[i] = group.key
      group.values.forEach((value, j) => {
        const labelName = group.xlabels[j]
        xLabels[j] = group.xlabels[j]
        data.push({ name: labelName, group: groupName, value: value.y })
      })
    })
    // console.log('TRANSFORMED DATA:', (data))
    return { data, xLabels, groupLabels }
  }

  function processSingleChart(d: Charts) {
    const chartID = d.chartID
    const chartType = d.chartType
    const chartData = d.chartData
    // console.log(`WRITING GRAPH OF TYPE ${chartType} TO ID #${chartID}:`, chartData)

    let data = []

    switch (chartType) {
      case 'lineChart': {
        const {
          data: data_,
          xLabels,
          groupLabels,
        } = convertChartData(chartData)
        data = data_
        const container = document.getElementById(chartID) || document.body
        const svg =
          container &&
          newSvg(`#${chartID}`, container.style.width, container.style.height)

        const myChart = new dimple.chart(svg, data)
        const xAxis = myChart.addCategoryAxis('x', 'name')
        xAxis.addOrderRule(xLabels)
        xAxis.addGroupOrderRule(groupLabels)
        xAxis.title = null
        const yAxis = myChart.addMeasureAxis('y', 'value')
        yAxis.title = null
        myChart.addSeries('group', dimple.plot.line)
        myChart.addLegend(60, 10, 500, 20, 'right')
        myChart.draw()

        break
      }
      case 'barChart': {
        const {
          data: data_,
          xLabels,
          groupLabels,
        } = convertChartData(chartData)
        data = data_
        const container = document.getElementById(chartID) || document.body
        const svg = newSvg(
          '#' + chartID,
          container.style.width,
          container.style.height,
        )

        const myChart = new dimple.chart(svg, data)
        const xAxis = myChart.addCategoryAxis('x', ['name', 'group'])
        xAxis.addOrderRule(xLabels)
        xAxis.addGroupOrderRule(groupLabels)
        xAxis.title = null
        const yAxis = myChart.addMeasureAxis('y', 'value')
        yAxis.title = null
        myChart.addSeries('group', dimple.plot.bar)
        myChart.addLegend(60, 10, 500, 20, 'right')
        myChart.draw()
        break
      }
      case 'pieChart':
      case 'pie3DChart': {
        // data = chartData[0].values
        // chart = nv.models.pieChart()
        // nvDraw(chart, data)
        const { data: data_, groupLabels } = convertChartData(chartData)
        data = data_
        const container = document.getElementById(chartID) || document.body
        const svg = newSvg(
          `#${chartID}`,
          container.style.width,
          container.style.height,
        )

        const myChart = new dimple.chart(svg, data)
        const pieAxis = myChart.addMeasureAxis('p', 'value')
        pieAxis.addOrderRule(groupLabels)
        myChart.addSeries('name', dimple.plot.pie)
        myChart.addLegend(50, 20, 400, 300, 'left')
        myChart.draw()
        break
      }
      case 'areaChart': {
        const {
          data: data_,
          xLabels,
          groupLabels,
        } = convertChartData(chartData)
        data = data_
        const container = document.getElementById(chartID) || document.body
        const svg = newSvg(
          '#' + chartID,
          container.style.width,
          container.style.height,
        )

        const myChart = new dimple.chart(svg, data)
        const xAxis = myChart.addCategoryAxis('x', 'name')
        xAxis.addOrderRule(xLabels)
        xAxis.addGroupOrderRule(groupLabels)
        xAxis.title = null
        const yAxis = myChart.addMeasureAxis('y', 'value')
        yAxis.title = null
        myChart.addSeries('group', dimple.plot.area)
        myChart.addLegend(60, 10, 500, 20, 'right')
        myChart.draw()

        break
      }
      case 'scatterChart': {
        for (let i = 0; i < chartData.length; i++) {
          const arr = []
          for (let j = 0; j < chartData[i].length; j++) {
            arr.push({ x: j, y: chartData[i][j] })
          }
          data.push({ key: 'data' + (i + 1), values: arr })
        }
        break
      }
      default:
    }
  }

  function findElementClass(element: Element, name: string) {
    const result: Element[] = []
    const dfs = (list: Element[]) => {
      list.forEach((item) => {
        if (item.children.length > 0) {
          dfs(Array.from(item.children))
        }
        if (Array.from(item.classList).includes(name)) {
          result.push(item)
        }
      })
    }
    if (element.children.length > 0) {
      dfs(Array.from(element.children))
    }
    return result
  }

  function setNumericBullets(elem: HTMLCollection) {
    const paragraphsArray = Array.from(elem)
    for (let i = 0; i < paragraphsArray.length; i++) {
      // innerHTML
      const buSpan = findElementClass(
        paragraphsArray[i],
        'numeric-bullet-style',
      )
      if (buSpan.length > 0) {
        // console.log("DIV-"+i+":");
        let prevBultTyp: string | null = ''
        let prevBultLvl: string | null = ''
        let buletIndex = 0
        const tmpArry = []
        let tmpArryIndx = 0
        const buletTypSrry = []
        for (let j = 0; j < buSpan.length; j++) {
          const bulletType = buSpan[j].getAttribute(`data-bulltname`)
          const bulletLvl = buSpan[j].getAttribute('data-bulltlvl')
          // console.log(j+" - "+bult_typ+" lvl: "+bult_lvl );
          if (buletIndex === 0) {
            prevBultTyp = bulletType
            prevBultLvl = bulletLvl
            tmpArry[tmpArryIndx] = buletIndex
            buletTypSrry[tmpArryIndx] = bulletType
            buletIndex++
          } else {
            if (bulletType === prevBultTyp && bulletLvl === prevBultLvl) {
              prevBultTyp = bulletType
              prevBultLvl = bulletLvl
              buletIndex++
              tmpArry[tmpArryIndx] = buletIndex
              buletTypSrry[tmpArryIndx] = bulletType
            } else if (
              bulletType !== prevBultTyp &&
              bulletLvl === prevBultLvl
            ) {
              prevBultTyp = bulletType
              prevBultLvl = bulletLvl
              tmpArryIndx++
              tmpArry[tmpArryIndx] = buletIndex
              buletTypSrry[tmpArryIndx] = bulletType
              buletIndex = 1
            } else if (
              bulletType !== prevBultTyp &&
              Number(bulletLvl) > Number(prevBultLvl)
            ) {
              prevBultTyp = bulletType
              prevBultLvl = bulletLvl
              tmpArryIndx++
              tmpArry[tmpArryIndx] = buletIndex
              buletTypSrry[tmpArryIndx] = bulletType
              buletIndex = 1
            } else if (
              bulletType !== prevBultTyp &&
              Number(bulletLvl) < Number(prevBultLvl)
            ) {
              prevBultTyp = bulletType
              prevBultLvl = bulletLvl
              tmpArryIndx--
              buletIndex = tmpArry[tmpArryIndx] + 1
            }
          }
          // console.log(buletTypSrry[tmpArryIndx]+" - "+buletIndex);
          const numIdx = getNumTypeNum(buletTypSrry[tmpArryIndx], buletIndex)
          buSpan[j].innerHTML = numIdx.toString()
          // $(buSpan[j]).html(numIdx.toString())
        }
      }
    }
  }

  function getNumTypeNum(numTyp: any, num: string | number) {
    let rtrnNum: string | number = ''
    switch (numTyp) {
      case 'arabicPeriod':
        rtrnNum = num + '. '
        break
      case 'arabicParenR':
        rtrnNum = num + ') '
        break
      case 'alphaLcParenR':
        rtrnNum = alphaNumeric(num, 'lowerCase') + ') '
        break
      case 'alphaLcPeriod':
        rtrnNum = alphaNumeric(num, 'lowerCase') + '. '
        break

      case 'alphaUcParenR':
        rtrnNum = alphaNumeric(num, 'upperCase') + ') '
        break
      case 'alphaUcPeriod':
        rtrnNum = alphaNumeric(num, 'upperCase') + '. '
        break

      case 'romanUcPeriod':
        rtrnNum = romanize(num) + '. '
        break
      case 'romanLcParenR':
        rtrnNum = romanize(num) + ') '
        break
      case 'hebrew2Minus':
        rtrnNum = hebrew2Minus.format(Number(num)) + '-'
        break
      default:
        rtrnNum = num
    }
    return rtrnNum
  }

  function romanize(num: string | number) {
    if (!+num) return false
    const digits = String(+num).split('')
    const key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ]
    let roman = ''
    let i = 3
    while (i--) roman = (key[+digits.pop()! + i * 10] || '') + roman
    return new Array(+digits.join('') + 1).join('M') + roman
  }

  const hebrew2Minus = archaicNumbers([
    [1000, ''],
    [400, 'ת'],
    [300, 'ש'],
    [200, 'ר'],
    [100, 'ק'],
    [90, 'צ'],
    [80, 'פ'],
    [70, 'ע'],
    [60, 'ס'],
    [50, 'נ'],
    [40, 'מ'],
    [30, 'ל'],
    [20, 'כ'],
    [10, 'י'],
    [9, 'ט'],
    [8, 'ח'],
    [7, 'ז'],
    [6, 'ו'],
    [5, 'ה'],
    [4, 'ד'],
    [3, 'ג'],
    [2, 'ב'],
    [1, 'א'],
    [/יה/, 'ט״ו'],
    [/יו/, 'ט״ז'],
    [/([א-ת])([א-ת])$/, '$1״$2'],
    [/^([א-ת])$/, '$1׳'],
  ])

  function archaicNumbers(arr: ((string | number)[] | (string | RegExp)[])[]) {
    return {
      format: function (n: number) {
        let ret = ''
        arr.forEach((item) => {
          const num = item[0]
          if (parseInt(num.toString()) > 0) {
            for (; n >= Number(num); n -= Number(num)) ret += item[1]
          } else {
            ret = ret.replace(num.toString(), item[1] as string)
          }
        })
        return ret
      },
    }
  }

  function alphaNumeric(
    num: number | string,
    upperLower: 'upperCase' | 'lowerCase',
  ) {
    num = Number(num) - 1
    let aNum = ''
    if (upperLower === 'upperCase') {
      aNum = (
        (num / 26 >= 1 ? String.fromCharCode(num / 26 + 64) : '') +
        String.fromCharCode((num % 26) + 65)
      ).toUpperCase()
    } else if (upperLower === 'lowerCase') {
      aNum = (
        (num / 26 >= 1 ? String.fromCharCode(num / 26 + 64) : '') +
        String.fromCharCode((num % 26) + 65)
      ).toLowerCase()
    }
    return aNum
  }
}
