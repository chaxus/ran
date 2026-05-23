import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/radar';

const sampleAbilitys = JSON.stringify([
  { abilityName: 'Speed', scoreRate: 80, backgroundColor: '#fff', fontSize: '12px', fontFamily: 'Arial', fontColor: '#000' },
  { abilityName: 'Power', scoreRate: 60, backgroundColor: '#fff', fontSize: '12px', fontFamily: 'Arial', fontColor: '#000' },
  { abilityName: 'Defense', scoreRate: 90, backgroundColor: '#fff', fontSize: '12px', fontFamily: 'Arial', fontColor: '#000' },
]);

describe('r-radar contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mount = () => {
    const radar = document.createElement('r-radar') as any;
    document.body.appendChild(radar);
    return radar;
  };

  it('renders shadow DOM with .ran-radar container and canvas', () => {
    const radar = mount();
    expect(radar._shadowDom).toBeTruthy();
    expect(radar._shadowDom.querySelector('.ran-radar')).not.toBeNull();
    expect(radar._shadowDom.querySelector('canvas')).not.toBeNull();
  });

  it('reflects abilitys attribute as JSON string', () => {
    const radar = mount();
    radar.setAttribute('abilitys', sampleAbilitys);
    expect(radar.getAttribute('abilitys')).toBe(sampleAbilitys);
  });

  it('abilitys getter parses JSON attribute', () => {
    const radar = mount();
    radar.setAttribute('abilitys', sampleAbilitys);
    const parsed = radar.abilitys;
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].abilityName).toBe('Speed');
  });

  it('abilitys setter serializes object array to JSON', () => {
    const radar = mount();
    const data = [{ abilityName: 'Agility', scoreRate: 50, backgroundColor: '#fff', fontSize: '14px', fontFamily: 'Helvetica', fontColor: '#333' }];
    radar.abilitys = data;
    expect(radar.getAttribute('abilitys')).toBe(JSON.stringify(data));
  });

  it('abilitys setter accepts string directly', () => {
    const radar = mount();
    radar.abilitys = sampleAbilitys;
    expect(radar.getAttribute('abilitys')).toBe(sampleAbilitys);
  });

  it('returns raw string for abilitys when JSON.parse fails', () => {
    const radar = mount();
    radar.setAttribute('abilitys', 'not-json');
    expect(radar.abilitys).toBe('not-json');
  });

  it('reflects colorPolygon property', () => {
    const radar = mount();
    radar.colorPolygon = '#ff0000';
    expect(radar.getAttribute('colorPolygon')).toBe('#ff0000');
    expect(radar.colorPolygon).toBe('#ff0000');
  });

  it('reflects colorLine property', () => {
    const radar = mount();
    radar.colorLine = '#00ff00';
    expect(radar.colorLine).toBe('#00ff00');
  });

  it('reflects fillColor property', () => {
    const radar = mount();
    radar.fillColor = 'rgba(0,0,255,0.5)';
    expect(radar.fillColor).toBe('rgba(0,0,255,0.5)');
  });

  it('reflects strokeColor property', () => {
    const radar = mount();
    radar.strokeColor = '#123456';
    expect(radar.strokeColor).toBe('#123456');
  });

  it('sheet property reflects to attribute', () => {
    const radar = mount();
    radar.sheet = 'canvas { border: 1px solid red; }';
    expect(radar.getAttribute('sheet')).toBe('canvas { border: 1px solid red; }');
  });

  const makeCtx = () => ({
    save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), closePath: vi.fn(),
    stroke: vi.fn(), fill: vi.fn(), lineTo: vi.fn(), moveTo: vi.fn(),
    fillText: vi.fn(), arc: vi.fn(), fillRect: vi.fn(), roundRect: vi.fn(),
    strokeStyle: '', fillStyle: '', lineWidth: 1, font: '',
    textAlign: '', textBaseline: '',
    setLineDash: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 40 }),
    getBoundingClientRect: vi.fn().mockReturnValue({ width: 40, height: 20 }),
  });

  it('refreshData does not throw when abilitys is set', () => {
    const radar = mount();
    const mockCtx = makeCtx();
    vi.spyOn(radar.abilityRadarChart, 'getContext').mockReturnValue(mockCtx as any);
    radar.setAttribute('abilitys', sampleAbilitys);
    expect(() => radar.refreshData()).not.toThrow();
  });

  it('refreshData exercises drawing methods when container has dimensions', () => {
    const radar = mount();
    const mockCtx = makeCtx();
    vi.spyOn(radar.abilityRadarChart, 'getContext').mockReturnValue(mockCtx as any);
    // Give the container non-zero dimensions so drawing paths run
    Object.defineProperty(radar.abilityRadarChartContainer, 'clientWidth', { get: () => 400, configurable: true });
    Object.defineProperty(radar.abilityRadarChartContainer, 'clientHeight', { get: () => 400, configurable: true });

    radar.setAttribute('abilitys', sampleAbilitys);
    radar.refreshData();

    // Drawing methods should have been called
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('attributeChangedCallback calls refreshData on abilitys change', () => {
    const radar = mount();
    const refreshSpy = vi.spyOn(radar, 'refreshData').mockImplementation(() => undefined);
    radar.attributeChangedCallback('abilitys', null, sampleAbilitys);
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('disconnectedCallback disconnects resizeObserver', () => {
    const radar = mount();
    const disconnectSpy = vi.spyOn(radar.resizeObserver, 'disconnect');
    document.body.removeChild(radar);
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('abilitys getter returns null when attribute not set', () => {
    const radar = mount();
    // No abilitys attribute set - should return null (typeof null !== 'string')
    const result = radar.abilitys;
    expect(result).toBeNull();
  });

  it('resize method calls refreshData', () => {
    const radar = mount();
    const refreshSpy = vi.spyOn(radar, 'refreshData').mockImplementation(() => undefined);
    (radar as any).resize();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('refreshData exercises else label branch when label position differs', () => {
    const radar = mount();
    const mockCtx = makeCtx();
    vi.spyOn(radar.abilityRadarChart, 'getContext').mockReturnValue(mockCtx as any);
    Object.defineProperty(radar.abilityRadarChartContainer, 'clientWidth', { get: () => 400, configurable: true });
    Object.defineProperty(radar.abilityRadarChartContainer, 'clientHeight', { get: () => 400, configurable: true });

    // Use 6 abilities so we get labels on the left side (else branch)
    const sixAbilitys = JSON.stringify([
      { abilityName: 'A', abilityNum: 80 },
      { abilityName: 'B', abilityNum: 60 },
      { abilityName: 'C', abilityNum: 70 },
      { abilityName: 'D', abilityNum: 50 },
      { abilityName: 'E', abilityNum: 90 },
      { abilityName: 'F', abilityNum: 40 },
    ]);
    radar.setAttribute('abilitys', sixAbilitys);
    expect(() => radar.refreshData()).not.toThrow();
  });
});
