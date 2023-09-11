import { createCustomError, getPixelRatio } from '@/utils/index'

interface AbilityTags {
  abilityName: string
  scoreRate: number
  backgroundColor: string
  fontSize: string
  fontFamily: string
  fontColor: string
}

const BACKGROUND_COLOR = 'rgba(0,0,0,0)'
const FONT_COLOR = 'rgba(0,0,0,1)'
const POLYGON_COLOR = '#e6e6e6'
const LINE_COLOR = '#e6e6e6'
const FONT_FAMILY = '黑体'
const FILL_COLOR = 'rgba(255,121,35,0.60)'
const STROKE_COLOR = 'rgba(255,121,35,0.60)'

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-radar')) {
    class RadarChart extends HTMLElement {
      mData?: Array<AbilityTags>
      mCount?: number
      mW?: number
      mCenter?: number
      mRadius?: number
      mAngle?: number
      static get observedAttributes() {
        return [
          'abilitys',
          'colorPolygon',
          'colorLine',
          'fillColor',
          'strokeColor',
        ]
      }
      abilityRadarChartContainer: HTMLDivElement
      abilityRadarChart: HTMLCanvasElement
      _iconElement?: HTMLElement
      _shadowDom: ShadowRoot
      constructor() {
        super()
        this.abilityRadarChartContainer = document.createElement('div')
        this.abilityRadarChartContainer.setAttribute('class', 'radar')
        this.abilityRadarChart = document.createElement('canvas')
        this.abilityRadarChart.style.setProperty('width', '100%')
        this.abilityRadarChart.style.setProperty('height', '100%')
        this.abilityRadarChartContainer.appendChild(this.abilityRadarChart)
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        this._shadowDom = shadowRoot
        shadowRoot.appendChild(this.abilityRadarChartContainer)
      }
      get abilitys() {
        return this.getAttribute('abilitys')
      }
      set abilitys(value) {
        this.setAttribute('abilitys', value || '')
      }
      // 多边形颜色
      get colorPolygon() {
        return this.getAttribute('colorPolygon') || POLYGON_COLOR
      }
      set colorPolygon(value) {
        this.setAttribute('colorPolygon', value || POLYGON_COLOR)
      }
      // 顶点连线颜色
      get colorLine() {
        return this.getAttribute('colorLine') || LINE_COLOR
      }
      set colorLine(value) {
        this.setAttribute('colorLine', value || LINE_COLOR)
      }
      // 数据渲染处的颜色
      get fillColor() {
        return this.getAttribute('fillColor') || FILL_COLOR
      }
      set fillColor(value) {
        this.setAttribute('fillColor', value || FILL_COLOR)
      }
      // 数据渲染处线和点的颜色
      get strokeColor() {
        return this.getAttribute('strokeColor') || STROKE_COLOR
      }
      set strokeColor(value) {
        this.setAttribute('strokeColor', value || STROKE_COLOR)
      }
      refreshData() {
        const ctx = this.abilityRadarChart.getContext('2d')
        if (!this.abilityRadarChartContainer || !ctx) return
        const radio = getPixelRatio(ctx)
        const width = this.abilityRadarChartContainer.clientWidth * radio
        const height = this.abilityRadarChartContainer.clientHeight * radio
        this.abilityRadarChart.width = width
        this.abilityRadarChart.height = height
        this.mW = width
        this.mData = JSON.parse(this.abilitys || '')
        this.mCount = this.mData?.length || 1 // 边数
        this.mCenter = this.mW / 2 // 中心点
        this.mRadius = this.mCenter - 50 * radio // 半径(减去的值用于给绘制的文本留空间)
        this.mAngle = (Math.PI * 2) / this.mCount // 角度
        this.drawPolygon(ctx)
        this.drawSide(ctx)
        this.drawLines(ctx)
        this.drawText(ctx)
        this.drawRegion(ctx)
        this.drawCircle(ctx)
      }
      drawSide(ctx: CanvasRenderingContext2D) {
        if (!this.mRadius || !this.mCount || !this.mCenter || !this.mAngle)
          return
        ctx.save()
        ctx.strokeStyle = this.colorLine
        const r = this.mRadius
        for (let j = 0; j < this.mCount; j++) {
          const x = this.mCenter + r * Math.sin(this.mAngle * j)
          const y = this.mCenter + r * Math.cos(this.mAngle * j)
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
      // 绘制多边形边
      drawPolygon(ctx: CanvasRenderingContext2D) {
        if (!this.mRadius || !this.mCount || !this.mCenter || !this.mAngle)
          return
        ctx.save()
        ctx.strokeStyle = this.colorPolygon
        const r = this.mRadius / 4 // 单位半径
        ctx.setLineDash([6, 6])
        for (let i = 0; i < 4; i++) {
          ctx.beginPath()
          const currR = r * (i + 1) // 当前半径
          // 画n条边
          for (let j = 0; j < this.mCount; j++) {
            const x = this.mCenter + currR * Math.sin(this.mAngle * j)
            const y = this.mCenter + currR * Math.cos(this.mAngle * j)
            ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        }
        ctx.restore()
      }

      // 顶点连线
      drawLines(ctx: CanvasRenderingContext2D) {
        if (!this.mRadius || !this.mCount || !this.mCenter || !this.mAngle)
          return
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = this.colorLine
        for (let i = 0; i < this.mCount; i++) {
          const x = this.mCenter + this.mRadius * Math.sin(this.mAngle * i)
          const y = this.mCenter + this.mRadius * Math.cos(this.mAngle * i)
          ctx.moveTo(this.mCenter, this.mCenter)
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.restore()
      }

      // 绘制文本
      drawText(ctx: CanvasRenderingContext2D) {
        if (
          !this.mRadius ||
          !this.mCount ||
          !this.mCenter ||
          !this.mAngle ||
          !this.mData
        )
          return
        ctx.save()
        const radio = getPixelRatio(ctx)
        const defaultFontSize = this.mCenter / 12
        for (let i = 0; i < this.mCount; i++) {
          const x = this.mCenter + this.mRadius * Math.sin(this.mAngle * i)
          const y = this.mCenter + this.mRadius * Math.cos(this.mAngle * i)
          const backgroundColor =
            this.mData[i].backgroundColor || BACKGROUND_COLOR
          const fontColor = this.mData[i].fontColor || FONT_COLOR
          const fontFamily = this.mData[i].fontFamily || FONT_FAMILY
          const fontSize = this.mData[i].fontSize || defaultFontSize
          ctx.font = `${fontSize}px ${fontFamily}`
          if (this.mAngle * i >= 0 && this.mAngle * i < Math.PI / 2) {
            this.drawButton(
              ctx,
              backgroundColor,
              x,
              y,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityName,
              fontColor,
              fontFamily,
              fontSize,
            )
          } else if (
            this.mAngle * i >= Math.PI / 2 &&
            this.mAngle * i < Math.PI
          ) {
            this.drawButton(
              ctx,
              backgroundColor,
              x,
              y - 24 * radio,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityName,
              fontColor,
              fontFamily,
              fontSize,
            )
          } else if (
            this.mAngle * i >= Math.PI &&
            this.mAngle * i < (Math.PI * 3) / 2
          ) {
            this.drawButton(
              ctx,
              backgroundColor,
              x - 44 * radio,
              y - 24 * radio,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityName,
              fontColor,
              fontFamily,
              fontSize,
            )
          } else {
            this.drawButton(
              ctx,
              backgroundColor,
              x - 44 * radio,
              y,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityName,
              fontColor,
              fontFamily,
              fontSize,
            )
          }
        }

        ctx.restore()
      }

      drawButton(
        ctx: CanvasRenderingContext2D,
        color: string,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        text: string,
        fontColor: string,
        fontFamily: string,
        fontSize: string | number,
      ) {
        ctx.beginPath()
        const radio = getPixelRatio(ctx)
        ctx.fillStyle = color
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.arc(
          x + width - radius,
          y + radius,
          radius,
          (Math.PI * 3) / 2,
          Math.PI * 2,
        )
        ctx.lineTo(x + width, y + height - radius)
        ctx.arc(
          x + width - radius,
          y + height - radius,
          radius,
          Math.PI,
          Math.PI / 2,
        )
        ctx.lineTo(x + radius, y + height)
        ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI)
        ctx.lineTo(x, y + radius)
        ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2)
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.fillStyle = fontColor
        ctx.font = `${fontSize || 12 * radio}px ${fontFamily}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, x + width / 2, y + height / 2)
      }
      // 绘制数据区域
      drawRegion(ctx: CanvasRenderingContext2D) {
        if (
          !this.mRadius ||
          !this.mCount ||
          !this.mCenter ||
          !this.mAngle ||
          !this.mData
        )
          return
        const radio = getPixelRatio(ctx)
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i < this.mCount; i++) {
          const x =
            this.mCenter +
            (this.mRadius *
              Math.sin(this.mAngle * i) *
              this.mData[i].scoreRate) /
              100
          const y =
            this.mCenter +
            (this.mRadius *
              Math.cos(this.mAngle * i) *
              this.mData[i].scoreRate) /
              100
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = this.fillColor
        ctx.fill()
        ctx.strokeStyle = this.strokeColor
        ctx.lineWidth = 1 * radio
        ctx.stroke()
        ctx.restore()
      }

      // 画点
      drawCircle(ctx: CanvasRenderingContext2D) {
        if (
          !this.mRadius ||
          !this.mCount ||
          !this.mCenter ||
          !this.mAngle ||
          !this.mData
        )
          return
        const radio = getPixelRatio(ctx)
        ctx.save()
        for (let i = 0; i < this.mCount; i++) {
          const x =
            this.mCenter +
            (this.mRadius *
              Math.sin(this.mAngle * i) *
              this.mData[i].scoreRate) /
              100
          const y =
            this.mCenter +
            (this.mRadius *
              Math.cos(this.mAngle * i) *
              this.mData[i].scoreRate) /
              100
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.lineWidth = 1.5 * radio
          ctx.strokeStyle = this.strokeColor
          ctx.stroke()
        }
        ctx.restore()
      }

      connectedCallback() {
        this.refreshData()
      }
      disconnectCallback() {}
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        const attribute = [
          'abilitys',
          'colorPolygon',
          'colorLine',
          'fillColor',
          'strokeColor',
        ]
        if (
          attribute.includes(name) &&
          this.abilityRadarChartContainer &&
          oldValue !== newValue
        ) {
          this.refreshData()
        }
      }
    }
    customElements.define('r-radar', RadarChart)
    return RadarChart
  } else {
    return createCustomError('document is undefined or r-radar is exist')
  }
}

export default Custom()
