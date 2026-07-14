import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Hero from '../components/catalog/Hero';
import Highlights from '../components/catalog/Highlights';
import MulticastWAN from '../components/catalog/MulticastWAN';
import Channels from '../components/catalog/Channels';
import Testimonials from '../components/catalog/Testimonials';
import FAQ from '../components/catalog/FAQ';
import ScrollToHash from '../components/ScrollToHash';

export default function Catalog() {
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <ScrollToHash />
      <Hero />
      {/* <LogoCollection /> */}
      <MulticastWAN />
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