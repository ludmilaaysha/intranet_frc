import Container from '@mui/material/Container';
import Hero from '../components/catalog/Hero';
// import MulticastWAN from '../components/catalog/MulticastWAN';
import Channels from '../components/catalog/Channels';
import ScrollToHash from '../components/ScrollToHash';

export default function Catalog() {
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <ScrollToHash />
      <Hero />
      {/* <LogoCollection /> */}
      {/* <MulticastWAN /> */}
      <Channels />
      {/* <Divider /> */}
      {/* <Testimonials />
      <Divider />
      <Highlights />
      <Divider /> */}
      {/* <Pricing /> */}
      {/* <Divider />
      <FAQ /> */}
    </Container>
  );
}