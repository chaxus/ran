import { createCustomError, getPixelRatio } from '@/utils/index'

interface AbilityTags {
  abilityTagName: string
  userScoreRate: number
  backgroundColor: string
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-radar')) {
    class RadarChart extends HTMLElement {
      mData: Array<AbilityTags>
      mCount: number
      mW: number
      mCenter: number
      mRadius: number
      mAngle: number
      mColorPolygon: string
      mColorLines: string
      static get observedAttributes() {
        return ['abilityTags']
      }
      abilityRadarChartContainer: HTMLDivElement
      abilityRadarChart: HTMLCanvasElement
      _iconElement?: HTMLElement
      _shadowDom: ShadowRoot
      constructor() {
        super()
        this.abilityRadarChartContainer = document.createElement('div')
        this.abilityRadarChartContainer.setAttribute(
          'class',
          'radar-chart-container',
        )
        this.abilityRadarChart = document.createElement('canvas')
        this.abilityRadarChart.style.setProperty('width', '100%')
        this.abilityRadarChart.style.setProperty('height', '100%')
        this.abilityRadarChartContainer.appendChild(this.abilityRadarChart)
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        this._shadowDom = shadowRoot
        this.mW = 400
        this.mData = JSON.parse(this.abilityTags || '')
        this.mCount = this.mData?.length || 1 // 边数
        this.mCenter = this.mW / 2 // 中心点
        this.mRadius = this.mCenter - 90 // 半径(减去的值用于给绘制的文本留空间)
        this.mAngle = (Math.PI * 2) / this.mCount // 角度
        this.mColorPolygon = '#e6e6e6' // 多边形颜色
        this.mColorLines = '#e6e6e6' // 顶点连线颜色
        shadowRoot.appendChild(this.abilityRadarChartContainer)
      }
      get abilityTags() {
        return this.getAttribute('abilityTags')
      }
      set abilityTags(value) {
        this.setAttribute('abilityTags', value || '')
      }
      get colorList() {
        return this.getAttribute('colorList')
      }
      set colorList(value) {
        this.setAttribute('colorList', value || '')
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
        this.mData = JSON.parse(this.abilityTags || '')
        this.mCount = this.mData?.length || 1
        this.mCenter = this.mW / 2
        this.mRadius = this.mCenter - 50 * radio
        this.mAngle = (Math.PI * 2) / this.mCount
        this.drawPolygon(ctx)
        this.drawSide(ctx)
        this.drawLines(ctx)
        this.drawText(ctx)
        this.drawRegion(ctx)
        this.drawCircle(ctx)
      }
      drawSide(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.strokeStyle = this.mColorLines
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
        ctx.save()
        ctx.strokeStyle = this.mColorPolygon
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
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = this.mColorLines
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
        ctx.save()
        const radio = getPixelRatio(ctx)
        const fontSize = this.mCenter / 12
        ctx.font = `${fontSize}px Microsoft Yahei`
        for (let i = 0; i < this.mCount; i++) {
          const x = this.mCenter + this.mRadius * Math.sin(this.mAngle * i)
          const y = this.mCenter + this.mRadius * Math.cos(this.mAngle * i)
          if (this.mAngle * i >= 0 && this.mAngle * i < Math.PI / 2) {
            this.drawButton(
              ctx,
              this.colorList[i],
              x,
              y,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityTagName,
            )
            // ctx.fillText(mData[i].abilityTagName, x, y + fontSize);
          } else if (
            this.mAngle * i >= Math.PI / 2 &&
            this.mAngle * i < Math.PI
          ) {
            this.drawButton(
              ctx,
              this.colorList[i],
              x,
              y - 24 * radio,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityTagName,
            )
            // ctx.fillText(mData[i].abilityTagName, x - ctx.measureText(mData[i].abilityTagName).width, y + fontSize);
          } else if (
            this.mAngle * i >= Math.PI &&
            this.mAngle * i < (Math.PI * 3) / 2
          ) {
            this.drawButton(
              ctx,
              this.colorList[i],
              x - 44 * radio,
              y - 24 * radio,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityTagName,
            )
            // ctx.fillText(mData[i].abilityTagName, x - ctx.measureText(mData[i].abilityTagName).width, y);
          } else {
            // ctx.fillText(mData[i].abilityTagName, x, y);
            this.drawButton(
              ctx,
              this.colorList[i],
              x - 44 * radio,
              y,
              44 * radio,
              24 * radio,
              12 * radio,
              this.mData[i].abilityTagName,
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
      ) {
        ctx.beginPath()
        const radio = getPixelRatio(ctx)
        ctx.fillStyle = color || this.colorList[4]
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
        ctx.fillStyle = '#fff'
        ctx.font = `${12 * radio}px 黑体`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, x + width / 2, y + height / 2)
      }
      // 绘制数据区域
      drawRegion(ctx: CanvasRenderingContext2D) {
        const radio = getPixelRatio(ctx)
        ctx.save()
        ctx.beginPath()
        for (let i = 0; i < this.mCount; i++) {
          const x =
            this.mCenter +
            (this.mRadius *
              Math.sin(this.mAngle * i) *
              this.mData[i].userScoreRate) /
              100
          const y =
            this.mCenter +
            (this.mRadius *
              Math.cos(this.mAngle * i) *
              this.mData[i].userScoreRate) /
              100
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = 'rgba(255,121,35,0.60)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,121,35,0.60)'
        ctx.lineWidth = 1 * radio
        ctx.stroke()
        ctx.restore()
      }

      // 画点
      drawCircle(ctx: CanvasRenderingContext2D) {
        const radio = getPixelRatio(ctx)
        ctx.save()
        for (let i = 0; i < this.mCount; i++) {
          const x =
            this.mCenter +
            (this.mRadius *
              Math.sin(this.mAngle * i) *
              this.mData[i].userScoreRate) /
              100
          const y =
            this.mCenter +
            (this.mRadius *
              Math.cos(this.mAngle * i) *
              this.mData[i].userScoreRate) /
              100
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.lineWidth = 1.5 * radio
          ctx.strokeStyle = 'rgba(255,121,35,0.60)'
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
        if (
          name === 'abilityTags' &&
          this._shadowDom &&
          oldValue !== newValue
        ) {
          this.refreshData()
        }
      }
    }
    customElements.define('r-radar', RadarChart)
    return RadarChart
  }else{
    return createCustomError('document is undefined or r-radar is exist')
  }
}

export default Custom()