import type { LocaleDir } from './locales.ts';

interface IllustrationCopy {
  note: string;
  titles: [string, string, string];
  descriptions: [string, string, string];
}

export const DESIGN_ILLUSTRATION_STRINGS: Record<LocaleDir, IllustrationCopy> = {
  '': {
    note: 'Schematics derived from ranui foundation tokens, not live components.',
    titles: ['Keep rows aligned', 'Coordinate nested corners', 'Make small icons easier to click'],
    descriptions: [
      'When a row gains extra content, keep its text aligned with other rows and its actions in the same column.',
      'When both inner and outer boundaries are needed, subtract the inset from the outer radius: {outer} − {inset} = {inner}. The curves then share a center and look evenly spaced.',
      'The {control}px icon sits inside a {target}px click target, making it easier to use. Choose the target size for mouse or touch input, keeping neighboring targets separate.',
    ],
  },
  cn: {
    note: '基于 ranui 基础 token 绘制的示意图，并非真实组件。',
    titles: ['保持内容对齐', '让嵌套圆角协调', '让小图标更容易点击'],
    descriptions: [
      '某一行增加内容时，文字仍与其他行左对齐，右侧操作也保持在同一列。',
      '确实需要内外两层边界时，内圆角等于外圆角减去内缩距离：{outer} − {inset} = {inner}。这样两条圆弧共享圆心，边缘间距更均匀。',
      '图标本身是 {control}px，点击区域扩展到 {target}px，让操作更容易点中。实际尺寸应根据鼠标或触摸等输入方式选择，并让相邻点击区域保持间隔。',
    ],
  },
  ja: {
    note: 'ranui の基本トークンで描いた模式図で、実際のコンポーネントではありません。',
    titles: ['行の位置を揃える', '内外の角丸を揃える', '小さなアイコンを押しやすくする'],
    descriptions: [
      'ある行に内容が増えても、テキストの開始位置と操作ボタンの列を他の行と揃えます。',
      '内外の境界が必要な場合は、外側の半径から内側への余白を引きます：{outer} − {inset} = {inner}。円弧の中心が揃い、間隔が均一に見えます。',
      '{control}px のアイコンに {target}px のクリック領域を設け、押しやすくします。領域の大きさはマウスやタッチなどの入力方法に合わせ、隣の領域との間隔を確保します。',
    ],
  },
  es: {
    note: 'Esquemas derivados de los tokens base de ranui, no componentes reales.',
    titles: ['Alinea las filas', 'Coordina las esquinas anidadas', 'Facilita pulsar iconos pequeños'],
    descriptions: [
      'Cuando una fila recibe más contenido, mantén su texto alineado con las demás y sus acciones en la misma columna.',
      'Si hacen falta ambos bordes, resta el margen interior al radio exterior: {outer} − {inset} = {inner}. Las curvas comparten centro y mantienen una separación uniforme.',
      'El icono mide {control}px y su área de clic se amplía a {target}px para facilitar la interacción. Elige el tamaño según se use ratón o pantalla táctil y separa las áreas vecinas.',
    ],
  },
  pt: {
    note: 'Esquemas derivados dos tokens base do ranui, não componentes reais.',
    titles: ['Alinhe as linhas', 'Coordene os cantos internos e externos', 'Facilite o clique em ícones pequenos'],
    descriptions: [
      'Quando uma linha recebe mais conteúdo, mantenha o texto alinhado com as demais e as ações na mesma coluna.',
      'Quando as duas bordas forem necessárias, subtraia o recuo do raio externo: {outer} − {inset} = {inner}. As curvas compartilham o centro e mantêm uma distância uniforme.',
      'O ícone mede {control}px, e a área de clique se amplia para {target}px para facilitar o uso. Escolha o tamanho conforme a entrada por mouse ou toque e mantenha as áreas vizinhas separadas.',
    ],
  },
  ko: {
    note: 'ranui 기본 토큰으로 그린 도식이며 실제 컴포넌트가 아닙니다.',
    titles: ['행의 정렬 유지하기', '안팎 모서리 맞추기', '작은 아이콘을 쉽게 누르게 하기'],
    descriptions: [
      '한 행에 내용이 추가되어도 텍스트 시작점과 작업 버튼의 열을 다른 행과 맞춥니다.',
      '안팎의 경계가 모두 필요하다면 바깥 반경에서 안쪽 여백을 뺍니다: {outer} − {inset} = {inner}. 두 곡선의 중심이 맞아 간격이 고르게 보입니다.',
      '{control}px 아이콘의 클릭 영역을 {target}px로 넓혀 쉽게 누를 수 있게 합니다. 마우스나 터치 등 입력 방식에 맞게 크기를 정하고 인접 영역 사이에 간격을 둡니다.',
    ],
  },
  de: {
    note: 'Schematische Darstellungen aus ranui-Basistokens, keine echten Komponenten.',
    titles: ['Zeilen ausrichten', 'Verschachtelte Rundungen abstimmen', 'Kleine Symbole leichter anklickbar machen'],
    descriptions: [
      'Auch wenn eine Zeile zusätzlichen Inhalt erhält, bleiben Textbeginn und Aktionsspalte an den anderen Zeilen ausgerichtet.',
      'Sind beide Begrenzungen nötig, den Einzug vom Außenradius abziehen: {outer} − {inset} = {inner}. Die Kurven haben denselben Mittelpunkt und einen gleichmäßigen Abstand.',
      'Das Symbol ist {control}px groß, seine Klickfläche wird für leichtere Bedienung auf {target}px erweitert. Die Größe auf Maus- oder Touch-Eingabe abstimmen und benachbarte Flächen getrennt halten.',
    ],
  },
  fa: {
    note: 'این نمودارها از توکن‌های پایهٔ ranui ساخته شده‌اند و مؤلفهٔ واقعی نیستند.',
    titles: ['ردیف‌ها را هم‌تراز نگه دارید', 'گوشه‌های تودرتو را هماهنگ کنید', 'کلیک روی نمادهای کوچک را آسان کنید'],
    descriptions: [
      'وقتی محتوایی به یک ردیف اضافه می‌شود، ابتدای متن و ستون عملیات را با ردیف‌های دیگر هم‌تراز نگه دارید.',
      'اگر هر دو مرز داخلی و بیرونی لازم‌اند، فاصلهٔ داخلی را از شعاع بیرونی کم کنید: {outer} − {inset} = {inner}. منحنی‌ها هم‌مرکز می‌شوند و فاصله‌ای یکنواخت دارند.',
      'اندازهٔ نماد {control} پیکسل است و ناحیهٔ کلیک آن تا {target} پیکسل گسترش می‌یابد تا استفاده آسان‌تر شود. اندازه را متناسب با ماوس یا لمس انتخاب کنید و بین ناحیه‌های مجاور فاصله بگذارید.',
    ],
  },
};
