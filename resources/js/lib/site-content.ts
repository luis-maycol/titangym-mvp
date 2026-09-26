/**
 * Static content of the public pages. Edit texts here; photos live in
 * public/images/site and are delivered through the CDN.
 */
import {
    Activity,
    Bike,
    ClipboardList,
    Dumbbell,
    Flame,
    HeartPulse,
    Lock,
    ShowerHead,
    Sparkles,
    Timer,
    Users,
    Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Service = {
    slug: string;
    name: string;
    summary: string;
    description: string;
    highlights: string[];
    icon: LucideIcon;
    image: string;
};

export const services: Service[] = [
    {
        slug: 'musculacion',
        name: 'Musculación',
        summary: 'Máquinas y peso libre para ganar fuerza y masa muscular.',
        description:
            'Sala equipada con máquinas guiadas, poleas, racks de sentadilla, bancos y mancuernas de 2 a 50 kg. Un entrenador de sala te orienta en la técnica y te arma una rutina según tu objetivo.',
        highlights: [
            'Rutina inicial personalizada',
            'Zona de peso libre y máquinas',
            'Entrenador de sala en todos los turnos',
        ],
        icon: Dumbbell,
        image: 'images/site/services/musculacion.jpg',
    },
    {
        slug: 'funcional',
        name: 'Entrenamiento funcional',
        summary:
            'Circuitos de alta intensidad para mejorar tu condición física.',
        description:
            'Sesiones guiadas con kettlebells, TRX, cajones, cuerdas de batalla y trineo. Trabajas fuerza, resistencia y movilidad en grupos reducidos de máximo 12 personas.',
        highlights: [
            'Grupos reducidos',
            'Adaptado a todos los niveles',
            'Sesiones de 50 minutos',
        ],
        icon: Flame,
        image: 'images/site/services/funcional.jpg',
    },
    {
        slug: 'clases-grupales',
        name: 'Clases grupales',
        summary: 'Spinning, baile fitness y más, incluidas en tu membresía.',
        description:
            'Clases dirigidas con música y mucha energía. Llegas, te unes y entrenas; no necesitas reservar. Consulta el horario semanal abajo.',
        highlights: [
            'Incluidas en todos los planes',
            'Sin reserva previa',
            'Instructores certificados',
        ],
        icon: Users,
        image: 'images/site/services/clases.jpg',
    },
    {
        slug: 'evaluacion',
        name: 'Evaluación física',
        summary: 'Medimos tu punto de partida para seguir tu progreso.',
        description:
            'Al matricularte recibes una evaluación de peso, porcentaje de grasa, medidas y pruebas de fuerza y flexibilidad. Con eso definimos metas reales y medimos tu avance.',
        highlights: [
            'Incluida al matricularte',
            'Reevaluaciones periódicas en planes largos',
            'Resultados explicados por tu entrenador',
        ],
        icon: ClipboardList,
        image: 'images/site/services/evaluacion.jpg',
    },
];

export type ClassSlot = {
    time: string;
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
};

export const weekDays: { key: keyof Omit<ClassSlot, 'time'>; label: string }[] =
    [
        { key: 'monday', label: 'Lun' },
        { key: 'tuesday', label: 'Mar' },
        { key: 'wednesday', label: 'Mié' },
        { key: 'thursday', label: 'Jue' },
        { key: 'friday', label: 'Vie' },
        { key: 'saturday', label: 'Sáb' },
    ];

export const classSchedule: ClassSlot[] = [
    {
        time: '6:30 a. m.',
        monday: 'Funcional',
        tuesday: 'Spinning',
        wednesday: 'Funcional',
        thursday: 'Spinning',
        friday: 'Funcional',
    },
    {
        time: '9:00 a. m.',
        saturday: 'Baile fitness',
    },
    {
        time: '6:30 p. m.',
        monday: 'Spinning',
        tuesday: 'Baile fitness',
        wednesday: 'Spinning',
        thursday: 'Baile fitness',
        friday: 'Spinning',
    },
    {
        time: '8:00 p. m.',
        monday: 'Funcional',
        tuesday: 'Core & movilidad',
        wednesday: 'Funcional',
        thursday: 'Core & movilidad',
        friday: 'Funcional',
    },
];

export type Trainer = {
    slug: string;
    name: string;
    role: string;
    bio: string;
    specialties: string[];
    certifications: string[];
    image: string;
};

export const trainers: Trainer[] = [
    {
        slug: 'carlos-huaman',
        name: 'Carlos Huamán',
        role: 'Jefe de entrenadores',
        bio: 'Más de 10 años ayudando a principiantes y atletas a ganar fuerza con técnica segura.',
        specialties: ['Musculación', 'Fuerza', 'Hipertrofia'],
        certifications: ['Lic. en Ciencias del Deporte', 'Entrenador NSCA-CPT'],
        image: 'images/site/trainers/carlos-huaman.jpg',
    },
    {
        slug: 'milagros-quispe',
        name: 'Milagros Quispe',
        role: 'Coach de funcional',
        bio: 'Diseña circuitos exigentes pero adaptables para que cada persona avance a su ritmo.',
        specialties: ['Funcional', 'HIIT', 'Pérdida de grasa'],
        certifications: [
            'Certificación en Entrenamiento Funcional',
            'Primeros auxilios',
        ],
        image: 'images/site/trainers/milagros-quispe.jpg',
    },
    {
        slug: 'diego-palomino',
        name: 'Diego Palomino',
        role: 'Instructor de spinning',
        bio: 'Clases con energía y buena música para mejorar tu resistencia cardiovascular.',
        specialties: ['Spinning', 'Cardio', 'Resistencia'],
        certifications: ['Instructor de Indoor Cycling'],
        image: 'images/site/trainers/diego-palomino.jpg',
    },
    {
        slug: 'rosa-gutierrez',
        name: 'Rosa Gutiérrez',
        role: 'Instructora de baile fitness',
        bio: 'Convierte cada clase en una fiesta sin dejar de lado la técnica y el cuidado articular.',
        specialties: ['Baile fitness', 'Core', 'Movilidad'],
        certifications: ['Instructora de Baile Fitness', 'Pilates mat'],
        image: 'images/site/trainers/rosa-gutierrez.jpg',
    },
];

export type Facility = {
    name: string;
    description: string;
    image: string;
    icon: LucideIcon;
};

export const facilities: Facility[] = [
    {
        name: 'Sala de musculación',
        description:
            'Más de 40 estaciones entre máquinas guiadas, poleas y racks, con zona amplia de peso libre.',
        image: 'images/site/facilities/musculacion.jpg',
        icon: Dumbbell,
    },
    {
        name: 'Zona funcional',
        description:
            'Piso de caucho, kettlebells, TRX, cajones pliométricos, cuerdas y trineo de arrastre.',
        image: 'images/site/facilities/funcional.jpg',
        icon: Activity,
    },
    {
        name: 'Sala de clases',
        description:
            'Salón con espejos, sonido profesional y 25 bicicletas de spinning.',
        image: 'images/site/facilities/sala-clases.jpg',
        icon: Bike,
    },
    {
        name: 'Zona de cardio',
        description:
            'Trotadoras, elípticas y remos para calentar o completar tu entrenamiento.',
        image: 'images/site/facilities/cardio.jpg',
        icon: HeartPulse,
    },
    {
        name: 'Vestidores y duchas',
        description:
            'Vestidores separados, duchas con agua caliente y casilleros con candado.',
        image: 'images/site/facilities/vestidores.jpg',
        icon: ShowerHead,
    },
    {
        name: 'Recepción',
        description:
            'Control de acceso, venta de bebidas y atención para resolver tus dudas.',
        image: 'images/site/facilities/recepcion.jpg',
        icon: Sparkles,
    },
];

export const amenities: { label: string; icon: LucideIcon }[] = [
    { label: 'Wi-Fi gratuito', icon: Wifi },
    { label: 'Casilleros seguros', icon: Lock },
    { label: 'Duchas con agua caliente', icon: ShowerHead },
    { label: 'Horario extendido', icon: Timer },
];

export const values: { title: string; description: string }[] = [
    {
        title: 'Técnica primero',
        description:
            'Entrenar bien antes que entrenar pesado. Te corregimos para que avances sin lesiones.',
    },
    {
        title: 'Constancia',
        description:
            'Los resultados llegan con hábitos. Te acompañamos para que no abandones.',
    },
    {
        title: 'Comunidad',
        description:
            'Un ambiente respetuoso donde principiantes y avanzados entrenan juntos.',
    },
];

export const enrollmentSteps: { title: string; description: string }[] = [
    {
        title: 'Elige tu plan',
        description: 'Mensual, trimestral o anual. Precios en soles.',
    },
    {
        title: 'Crea tu cuenta',
        description: 'Solo tu nombre, DNI, celular y correo.',
    },
    {
        title: 'Paga con Yape',
        description: 'Escanea nuestro QR y sube la captura del pago.',
    },
    {
        title: '¡A entrenar!',
        description: 'Validamos tu pago y activamos tu membresía.',
    },
];
