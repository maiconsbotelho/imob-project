import { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna com Piscina',
    description: 'Linda casa moderna com piscina, churrasqueira e amplo jardim. Localizada em condomínio fechado com segurança 24h.',
    price: 850000,
    type: 'casa',
    status: 'venda',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    parking: 2,
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NjI5ODQyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NjYzNTc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    featured: true,
    createdAt: '2024-12-20'
  },
  {
    id: '2',
    title: 'Apartamento Luxuoso Vista Mar',
    description: 'Apartamento de alto padrão com vista panorâmica para o mar. Mobiliado e decorado.',
    price: 3500,
    type: 'apartamento',
    status: 'aluguel',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    address: 'Av. Beira Mar, 500',
    city: 'Rio de Janeiro',
    state: 'RJ',
    images: [
      'https://images.unsplash.com/photo-1654506012740-09321c969dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY2MzY1MjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    featured: true,
    createdAt: '2024-12-19'
  },
  {
    id: '3',
    title: 'Casa em Condomínio Fechado',
    description: 'Casa espaçosa em condomínio com área de lazer completa, próximo a escolas e comércio.',
    price: 650000,
    type: 'casa',
    status: 'venda',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    parking: 2,
    address: 'Condomínio Jardim das Acácias',
    city: 'Campinas',
    state: 'SP',
    images: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlfGVufDF8fHx8MTc2NjM4NTc1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    featured: false,
    createdAt: '2024-12-18'
  },
  {
    id: '4',
    title: 'Apartamento Compacto Centro',
    description: 'Apartamento funcional no centro da cidade, ideal para investimento ou primeiro imóvel.',
    price: 1800,
    type: 'apartamento',
    status: 'aluguel',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    parking: 1,
    address: 'Rua Central, 789',
    city: 'Belo Horizonte',
    state: 'MG',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NjI5ODQyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    featured: false,
    createdAt: '2024-12-17'
  }
];
