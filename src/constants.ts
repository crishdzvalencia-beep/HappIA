import { Activity, Moment } from './types';

export const MOMENTS: { id: Moment; label: string; icon: string; color: string }[] = [
  { id: 'move', label: 'Necesita moverse', icon: 'zap', color: 'bg-secondary-blue' },
  { id: 'calm', label: 'Necesita calma', icon: 'moon', color: 'bg-secondary-mint' },
  { id: 'connect', label: 'Necesita conexión', icon: 'heart', color: 'bg-secondary-coral' },
  { id: 'slowdown', label: 'Bajar revoluciones', icon: 'wind', color: 'bg-accent-lilac' },
];

export const SCREEN_FREE_ACTIVITIES: Activity[] = [
  {
    id: 'sf-1',
    title: 'La estatua divertida',
    description: 'Bailad y quedaos quietos de repente.',
    duration: '5 min',
    moment: 'screen-free',
    isScreenFree: true,
    materials: ['Música o tu voz'],
    steps: [
      'Pon música o canta una canción.',
      'Bailad con mucha energía.',
      'Cuando la música pare, ¡congelados!',
    ],
  },
  {
    id: 'sf-2',
    title: 'Detectives de sonidos',
    description: 'Cerrad los ojos y escuchad la casa.',
    duration: '3 min',
    moment: 'screen-free',
    isScreenFree: true,
    materials: ['Silencio'],
    steps: [
      'Sentaos en silencio y cerrad los ojos.',
      'Intentad identificar 3 sonidos diferentes.',
      'Abrid los ojos y compartid qué habéis oído.',
    ],
  },
  {
    id: 'sf-3',
    title: 'El cuento de 3 palabras',
    description: 'Cread una historia con solo 3 palabras cada uno.',
    duration: '5 min',
    moment: 'screen-free',
    isScreenFree: true,
    materials: ['Imaginación'],
    steps: [
      'Empieza tú con 3 palabras (ej: Había un perro...).',
      'El peque sigue con otras 3 palabras.',
      'Continuad hasta que la historia no tenga sentido.',
    ],
  },
];

export const ACTIVITIES: Activity[] = [
  ...SCREEN_FREE_ACTIVITIES,
  // MOVIMIENTO
  {
    id: 'm1',
    title: 'Carrera de animales',
    description: 'Cruzad el pasillo imitando a vuestro animal favorito.',
    duration: '5 min',
    moment: 'move',
    isScreenFree: true,
    materials: ['Espacio libre'],
    steps: [
      'Elegid un animal (ej: rana, pingüino).',
      'Id de una punta a otra de la habitación imitándolo.',
      '¡Cambiad de animal para la vuelta!',
    ],
  },
  {
    id: 'm2',
    title: 'Saltos en islas',
    description: 'Usa cojines como islas para cruzar el salón sin tocar el suelo.',
    duration: '10 min',
    moment: 'move',
    isScreenFree: true,
    materials: ['Cojines o almohadas'],
    steps: [
      'Coloca cojines en el suelo a poca distancia.',
      'El peque debe saltar de uno a otro.',
      '¡Cuidado con los tiburones del suelo!',
    ],
  },
  {
    id: 'm3',
    title: 'Cojín viajero',
    description: 'Llevad un cojín en la cabeza sin que se caiga.',
    duration: '5 min',
    moment: 'move',
    isScreenFree: true,
    materials: ['Un cojín'],
    steps: [
      'Poneos un cojín sobre la cabeza.',
      'Caminad despacio hasta un punto de la casa.',
      'Si se cae, ¡hay que empezar de nuevo!',
    ],
  },
  // CALMA
  {
    id: 'c1',
    title: 'Cueva con manta',
    description: 'Construid un refugio secreto con una silla y una manta.',
    duration: '15 min',
    moment: 'calm',
    isScreenFree: true,
    materials: ['Una manta', 'Dos sillas'],
    steps: [
      'Buscad una manta grande y dos sillas.',
      'Cread un techo y entrad dentro.',
      'Llevad un peluche o un libro para disfrutar del silencio.',
    ],
  },
  {
    id: 'c2',
    title: 'Soplamos la nube',
    description: 'Imaginad que vuestra respiración es un viento suave.',
    duration: '3 min',
    moment: 'calm',
    isScreenFree: true,
    materials: ['Ninguno'],
    steps: [
      'Sentaos cómodos y cerrad los ojos.',
      'Coged aire por la nariz muy despacio.',
      'Soltadlo suavemente como si soplarais una nube blanca.',
    ],
  },
  {
    id: 'c3',
    title: 'Cuento de respiración',
    description: 'Respira siguiendo el ritmo de una historia corta.',
    duration: '5 min',
    moment: 'calm',
    isScreenFree: true,
    materials: ['Ninguno'],
    steps: [
      'Imagina que eres una flor que se abre (inspira).',
      'Imagina que eres una vela que se apaga (espira).',
      'Repite 5 veces sintiendo tu cuerpo relajado.',
    ],
  },
  // CONEXIÓN
  {
    id: 'x1',
    title: 'Espejo de caras',
    description: 'Haz una cara graciosa y el peque debe repetirla.',
    duration: '5 min',
    moment: 'connect',
    isScreenFree: true,
    materials: ['Vuestras caras'],
    steps: [
      'Poneos frente a frente.',
      'Haz una mueca o gesto divertido.',
      'El peque debe imitarte exactamente igual.',
    ],
  },
  {
    id: 'x2',
    title: 'Manos que cuentan',
    description: 'Dibujad formas en la palma de la mano del otro.',
    duration: '5 min',
    moment: 'connect',
    isScreenFree: true,
    materials: ['Vuestras manos'],
    steps: [
      'Coge la mano del peque con cariño.',
      'Dibuja un sol, un corazón o una letra.',
      '¿Puede adivinar qué has dibujado?',
    ],
  },
  {
    id: 'x3',
    title: 'El abrazo que cambia',
    description: 'Un abrazo largo de 10 segundos para recargar energía.',
    duration: '2 min',
    moment: 'connect',
    isScreenFree: true,
    materials: ['Un abrazo'],
    steps: [
      'Daos un abrazo muy fuerte.',
      'Contad juntos hasta 10 muy despacio.',
      'Sentid cómo vuestro corazón se calma.',
    ],
  },
  // REGULACIÓN (Bajar revoluciones)
  {
    id: 'r1',
    title: 'Pisotones del volcán',
    description: 'Soltad la tensión pisando fuerte y luego muy suave.',
    duration: '5 min',
    moment: 'slowdown',
    isScreenFree: true,
    materials: ['Vuestros pies'],
    steps: [
      'Pisad fuerte como si fuerais un volcán (5 veces).',
      'Ahora caminad de puntillas como si fuerais plumas.',
      'Repite hasta que el volcán se duerma.',
    ],
  },
  {
    id: 'r2',
    title: 'Romper papel y parar',
    description: 'Rompe trozos de papel viejo y para cuando yo diga.',
    duration: '5 min',
    moment: 'slowdown',
    isScreenFree: true,
    materials: ['Papel viejo o periódico'],
    steps: [
      'Buscad papel de periódico o revistas viejas.',
      'Romped trozos con energía.',
      'Cuando digas "¡Stop!", todos quietos.',
    ],
  },
  {
    id: 'r3',
    title: 'Rugido y susurro',
    description: 'Gritad como leones y luego hablad como ratoncitos.',
    duration: '5 min',
    moment: 'slowdown',
    isScreenFree: true,
    materials: ['Vuestras voces'],
    steps: [
      'Haced un rugido de león muy grande.',
      'Ahora decid vuestro nombre en un susurro casi invisible.',
      'Terminad en silencio absoluto.',
    ],
  },
];

export const DAILY_TIPS = [
  "Jugar es la forma más alta de investigación. — Albert Einstein",
  "No necesitamos juguetes caros, solo tiempo y presencia.",
  "Cada momento de juego es una semilla de confianza.",
  "El juego es el lenguaje natural de los niños.",
  "Menos pantallas, más miradas.",
  "Tu presencia es el mejor juguete del mundo.",
  "El aburrimiento es la puerta a la creatividad."
];
