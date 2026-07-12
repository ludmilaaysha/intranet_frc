import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import CastConnectedRoundedIcon from '@mui/icons-material/CastConnectedRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import { SitemarkIcon } from '../CustomIcons';

const items = [
  {
    icon: <LiveTvRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Transmissão IPTV ao Vivo',
    description:
      'Assista aos canais da plataforma em tempo real por meio de transmissão IP, utilizando multicast para distribuir o conteúdo de forma eficiente a todos os clientes da rede.',
  },
  {
    icon: <CastConnectedRoundedIcon  sx={{ color: 'text.secondary' }} />,
    title: 'Distribuição Multicast',
    description:
      'Acesse diversos canais simultaneamente com transmissão multicast, reduzindo o consumo de banda e garantindo sincronização entre todos os usuários conectados.',
  },
  {
    icon: <VerifiedUserRoundedIcon  sx={{ color: 'text.secondary' }} />,
    title: 'Autenticação Segura',
    description:
      'Entre na plataforma com autenticação OAuth, garantindo que apenas usuários autorizados tenham acesso aos serviços e aos canais disponíveis.',
  },
  {
    icon: <DnsRoundedIcon  sx={{ color: 'text.secondary' }} />,
    title: 'Serviços Integrados de Rede',
    description:
      'Conte com DNS, DHCP e demais serviços de infraestrutura configurados automaticamente, proporcionando uma experiência de acesso simples e confiável.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}