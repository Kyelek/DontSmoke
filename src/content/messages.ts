import { DAY, HOUR, MINUTE } from '../utils/time';

export type MessageTone = 'welcome' | 'support' | 'motivation';

export interface MessageTier {
  id: string;
  tone: MessageTone;
  /** Tiempo mínimo sin fumar para entrar en este tramo (ms). */
  from: number;
  title: string;
  messages: string[];
}

/** Sin ningún registro todavía. */
export const WELCOME_TIER: MessageTier = {
  id: 'welcome',
  tone: 'welcome',
  from: 0,
  title: 'Empieza cuando quieras',
  messages: [
    'Toca el cigarro cada vez que fumes. Registrarlo es el primer paso para entender tu hábito.',
    'Aquí no hay juicios: solo datos honestos que te ayudarán a reducir poco a poco.',
  ],
};

/**
 * Tramos ordenados por tiempo sin fumar. El primero son consejos de
 * contención tras registrar un cigarro; a partir de ahí los mensajes van
 * siendo más ambiciosos a medida que crece la racha.
 */
export const MESSAGE_TIERS: MessageTier[] = [
  {
    id: 'support',
    tone: 'support',
    from: 0,
    title: 'Un tropiezo no borra tu progreso',
    messages: [
      'Registrarlo ya es un acto de consciencia. Respira hondo: el contador vuelve a empezar.',
      'Bebe un vaso de agua despacio. Ayuda a calmar la ansiedad y mantiene las manos ocupadas.',
      'Piensa qué te llevó a fumar esta vez: ¿estrés, café, aburrimiento? Conocer el disparador es media victoria.',
      'Las ganas intensas suelen durar solo unos minutos. La próxima vez, intenta esperar 5 minutos antes de decidir.',
      'Sal a caminar un momento o cambia de habitación. Romper la rutina debilita el impulso.',
      'No te castigues. Cada cigarro que dejas de fumar a partir de ahora cuenta igual.',
    ],
  },
  {
    id: 'early',
    tone: 'motivation',
    from: 30 * MINUTE,
    title: 'Tu cuerpo ya lo nota',
    messages: [
      'A los 20 minutos de dejar de fumar, el ritmo cardíaco y la tensión arterial empiezan a bajar.',
      'Si aparecen las ganas, prueba 4-7-8: inspira 4 segundos, aguanta 7, suelta el aire en 8.',
      'Mastica chicle sin azúcar o come una fruta: da a la boca algo que hacer.',
    ],
  },
  {
    id: 'hours',
    tone: 'motivation',
    from: 2 * HOUR,
    title: 'Vas ganando terreno',
    messages: [
      'La nicotina se reduce a la mitad en tu sangre cada dos horas aproximadamente. Cada minuto cuenta.',
      'Las ganas llegan en olas y se van. Ya has superado varias sin rendirte.',
      'Aprovecha este impulso: guarda el mechero y el tabaco fuera de tu vista.',
    ],
  },
  {
    id: 'half-day',
    tone: 'motivation',
    from: 8 * HOUR,
    title: 'Respiras mejor de lo que crees',
    messages: [
      'En unas 12 horas, el monóxido de carbono en tu sangre vuelve a niveles normales y llega más oxígeno a tus órganos.',
      'Medio día sin fumar. Tu corazón trabaja con menos esfuerzo.',
      'Si te cuesta dormir o estás irritable, es normal: son señales de que tu cuerpo se está reajustando.',
    ],
  },
  {
    id: 'day',
    tone: 'motivation',
    from: 1 * DAY,
    title: '¡Un día completo!',
    messages: [
      'Veinticuatro horas sin fumar. Esto ya no es suerte: es voluntad.',
      'Hacia las 48 horas el gusto y el olfato empiezan a despertar. La comida sabrá distinta.',
      'Calcula lo que has ahorrado hoy y date un pequeño capricho con ese dinero.',
    ],
  },
  {
    id: 'days',
    tone: 'motivation',
    from: 3 * DAY,
    title: 'Lo peor ya ha pasado',
    messages: [
      'A los 3 días la nicotina prácticamente ha salido de tu cuerpo. Los síntomas de abstinencia empiezan a remitir.',
      'Los bronquios se relajan y respirar cuesta menos. Prueba a subir unas escaleras y fíjate.',
      'Cuéntaselo a alguien de confianza. Compartir el logro lo hace más sólido.',
    ],
  },
  {
    id: 'week',
    tone: 'motivation',
    from: 7 * DAY,
    title: 'Una semana entera',
    messages: [
      'Siete días. Superar la primera semana es uno de los hitos más importantes para dejarlo definitivamente.',
      'Tu piel, tu aliento y tu ropa ya lo notan. Los demás también.',
      'Ahora el reto es mental: identifica las situaciones de riesgo y ten un plan para cada una.',
    ],
  },
  {
    id: 'weeks',
    tone: 'motivation',
    from: 14 * DAY,
    title: 'Estás cambiando de verdad',
    messages: [
      'Entre las 2 y las 12 semanas mejoran la circulación y la función pulmonar.',
      'Hacer ejercicio empieza a resultar más fácil. Es buen momento para moverte más.',
      'Ya no eres alguien que intenta dejarlo: eres alguien que no fuma.',
    ],
  },
  {
    id: 'month',
    tone: 'motivation',
    from: 30 * DAY,
    title: 'Un mes libre de humo',
    messages: [
      'Un mes. La tos y la sensación de falta de aire siguen disminuyendo en los próximos meses.',
      'Has demostrado que puedes. Sé tu propio ejemplo cuando dudes.',
      'Cuidado con el "solo uno": es la trampa más habitual. Tu racha vale mucho más.',
    ],
  },
];

/** Cada cuánto rota el mensaje dentro de un mismo tramo. */
export const MESSAGE_ROTATION_MS = 45 * 1000;
