import type { LocaleDir } from './locales.ts';

interface IllustrationCopy {
  note: string;
  titles: [string, string, string];
  descriptions: [string, string, string];
  play: string;
  pause: string;
  resume: string;
  replay: string;
  reduced: string;
  download: string;
}

export const DESIGN_ILLUSTRATION_STRINGS: Record<LocaleDir, IllustrationCopy> = {
  '': {
    note: 'Schematics built from ranui foundation tokens, not live components. Play a four-second explanation; production feedback stays immediate unless motion has a purpose.',
    titles: ['Hold the alignment spine', 'Derive the inner corner', 'Separate appearance from target'],
    descriptions: [
      'Optional row content appears without moving the text spine or the action column. Shared columns belong to the layout, not to each row’s content.',
      'When an inset is a necessary separate object: outer radius {outer} − inset {inset} = inner radius {inner}. Their corner centers meet. Remove redundant surfaces before tuning radii.',
      'A host example from DESIGN: a {control}px glyph inside a {target}px native command. Keep adjacent targets separate. This is not a new density or a universal target size.',
    ],
    play: 'Play',
    pause: 'Pause',
    resume: 'Resume',
    replay: 'Replay',
    reduced: 'Reduced motion · static view',
    download: 'Download SVG',
  },
  cn: {
    note: '基于 ranui 基础 token 绘制的示意图，并非真实组件。可播放四秒讲解；产品中的高频反馈仍以即时响应为主。',
    titles: ['保持共同的对齐线', '从内缩推导圆角', '区分外观与点击区域'],
    descriptions: [
      '可选内容出现时，文本起点与操作列保持不变。共同列由布局控制，不随单行内容漂移。',
      '仅在内层确实是独立对象时：外圆角 {outer} − 内缩 {inset} = 内圆角 {inner}，两者共享圆心。先移除多余背景，再调整圆角。',
      '沿用 DESIGN 的宿主示例：{control}px 图标位于 {target}px 原生按钮内。相邻点击区域应互不重叠；这不是新增密度或通用目标尺寸。',
    ],
    play: '播放',
    pause: '暂停',
    resume: '继续',
    replay: '重播',
    reduced: '已减少动态效果 · 静态图',
    download: '下载 SVG',
  },
  ja: {
    note: 'ranui の基本トークンで描いた模式図で、実際のコンポーネントではありません。4 秒の説明を再生できます。頻繁な操作への反応は原則として即時です。',
    titles: ['共通の整列軸を保つ', '内側の角丸を導く', '見た目と操作領域を分ける'],
    descriptions: [
      '任意の行の内容が現れても、テキストの開始位置と操作列は動きません。列の位置は各行の内容ではなくレイアウトで決まります。',
      '内側が独立した対象として必要な場合のみ、外側の半径 {outer} − 余白 {inset} = 内側の半径 {inner} とし、角の中心を揃えます。不要な面を先に取り除きます。',
      'DESIGN のホスト側の例：{control}px のアイコンを {target}px のネイティブボタン内に配置します。隣接する操作領域は重ねません。新しい密度や共通の目標寸法ではありません。',
    ],
    play: '再生',
    pause: '一時停止',
    resume: '続ける',
    replay: 'もう一度',
    reduced: '動きを減らす設定 · 静止画',
    download: 'SVG を保存',
  },
  es: {
    note: 'Esquemas con tokens base de ranui, no componentes reales. Reproduce una explicación de cuatro segundos; la respuesta frecuente del producto sigue siendo inmediata salvo que el movimiento aporte información.',
    titles: ['Mantén el eje de alineación', 'Deriva la esquina interior', 'Separa apariencia y área activa'],
    descriptions: [
      'El contenido opcional aparece sin desplazar el inicio del texto ni la columna de acciones. Las columnas compartidas dependen del diseño, no del contenido de cada fila.',
      'Solo si el interior es un objeto independiente necesario: radio exterior {outer} − margen {inset} = radio interior {inner}. Los centros coinciden. Elimina primero las superficies redundantes.',
      'Ejemplo del anfitrión en DESIGN: icono de {control}px dentro de un botón nativo de {target}px. Evita solapar áreas adyacentes. No es una nueva densidad ni una medida universal.',
    ],
    play: 'Reproducir',
    pause: 'Pausar',
    resume: 'Continuar',
    replay: 'Repetir',
    reduced: 'Movimiento reducido · vista estática',
    download: 'Descargar SVG',
  },
  pt: {
    note: 'Esquemas com tokens base do ranui, não componentes reais. Reproduza uma explicação de quatro segundos; respostas frequentes continuam imediatas, salvo quando o movimento esclarece uma mudança.',
    titles: ['Mantenha o eixo de alinhamento', 'Derive o canto interno', 'Separe aparência e área de toque'],
    descriptions: [
      'O conteúdo opcional surge sem mover o início do texto ou a coluna de ações. Colunas compartilhadas pertencem ao layout, não ao conteúdo de cada linha.',
      'Apenas quando o interior é um objeto separado necessário: raio externo {outer} − recuo {inset} = raio interno {inner}. Os centros coincidem. Remova primeiro superfícies redundantes.',
      'Exemplo do anfitrião em DESIGN: ícone de {control}px dentro de um botão nativo de {target}px. Não sobreponha áreas vizinhas. Não é uma nova densidade nem um tamanho universal.',
    ],
    play: 'Reproduzir',
    pause: 'Pausar',
    resume: 'Continuar',
    replay: 'Repetir',
    reduced: 'Movimento reduzido · vista estática',
    download: 'Baixar SVG',
  },
  ko: {
    note: 'ranui 기본 토큰으로 그린 도식이며 실제 컴포넌트가 아닙니다. 4초 설명을 재생할 수 있습니다. 제품의 잦은 피드백은 움직임이 필요한 경우 외에는 즉시 반응합니다.',
    titles: ['공통 정렬 축 유지', '안쪽 모서리 계산', '외형과 조작 영역 구분'],
    descriptions: [
      '선택적인 내용이 나타나도 텍스트 시작점과 작업 열은 움직이지 않습니다. 공통 열은 개별 행의 내용이 아닌 레이아웃이 결정합니다.',
      '안쪽이 별도 객체로 꼭 필요한 경우에만 바깥 반경 {outer} − 안쪽 여백 {inset} = 안쪽 반경 {inner}로 중심을 맞춥니다. 불필요한 표면부터 제거합니다.',
      'DESIGN의 호스트 예시: {target}px 네이티브 버튼 안에 {control}px 아이콘을 배치합니다. 인접 조작 영역은 겹치지 않아야 합니다. 새 밀도나 보편적인 목표 크기가 아닙니다.',
    ],
    play: '재생',
    pause: '일시 정지',
    resume: '계속',
    replay: '다시 재생',
    reduced: '동작 줄이기 · 정적 보기',
    download: 'SVG 다운로드',
  },
  de: {
    note: 'Schematische Darstellungen mit ranui-Basistokens, keine echten Komponenten. Die Erklärung dauert vier Sekunden; häufige Rückmeldungen bleiben unmittelbar, sofern Bewegung keinen Zweck erfüllt.',
    titles: ['Die gemeinsame Flucht halten', 'Die innere Rundung ableiten', 'Form und Zielfläche trennen'],
    descriptions: [
      'Optionale Inhalte erscheinen, ohne Textbeginn und Aktionsspalte zu verschieben. Gemeinsame Spalten gehören zum Layout, nicht zum Inhalt einzelner Zeilen.',
      'Nur wenn innen ein eigenes Objekt erforderlich ist: Außenradius {outer} − Einzug {inset} = Innenradius {inner}. Die Eckmittelpunkte stimmen überein. Überflüssige Flächen zuerst entfernen.',
      'Host-Beispiel aus DESIGN: {control}px-Symbol in einer nativen {target}px-Schaltfläche. Benachbarte Ziele nicht überlappen. Keine neue Dichte oder universelle Zielgröße.',
    ],
    play: 'Abspielen',
    pause: 'Pause',
    resume: 'Fortsetzen',
    replay: 'Wiederholen',
    reduced: 'Reduzierte Bewegung · statische Ansicht',
    download: 'SVG herunterladen',
  },
  fa: {
    note: 'این نمودارها با توکن‌های پایهٔ ranui ساخته شده‌اند و مؤلفهٔ واقعی نیستند. توضیح چهارثانیه‌ای را پخش کنید؛ بازخورد پرتکرار محصول، مگر با دلیل مشخص، فوری می‌ماند.',
    titles: ['محور تراز مشترک را حفظ کنید', 'شعاع گوشهٔ داخلی را محاسبه کنید', 'ظاهر را از ناحیهٔ هدف جدا کنید'],
    descriptions: [
      'با نمایش محتوای اختیاری، ابتدای متن و ستون عملیات جابه‌جا نمی‌شوند. ستون مشترک به چیدمان تعلق دارد، نه محتوای هر ردیف.',
      'فقط وقتی بخش داخلی یک شیء مستقل ضروری است: شعاع بیرونی {outer} منهای فاصلهٔ {inset} برابر شعاع داخلی {inner} است؛ مرکز گوشه‌ها مشترک می‌شود. ابتدا سطوح اضافی را حذف کنید.',
      'نمونهٔ میزبان از DESIGN: نماد {control} پیکسلی در دکمهٔ بومی {target} پیکسلی قرار می‌گیرد. هدف‌های مجاور نباید هم‌پوشانی داشته باشند. این چگالی تازه یا اندازه‌ای همگانی نیست.',
    ],
    play: 'پخش',
    pause: 'مکث',
    resume: 'ادامه',
    replay: 'پخش دوباره',
    reduced: 'حرکت کاهش‌یافته · نمای ثابت',
    download: 'دریافت SVG',
  },
};
