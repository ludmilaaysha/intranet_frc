import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Hero from '../components/catalog/Hero';
import Highlights from '../components/catalog/Highlights';
import Features from '../components/Features';
import Testimonials from '../components/catalog/Testimonials';
import FAQ from '../components/catalog/FAQ';

export default function MarketingPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* <div> */}
        <Hero />
        {/* <LogoCollection /> */}
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        {/* <Pricing /> */}
        <Divider />
        <FAQ />
        <Divider />
      {/* </div> */}
    </Container>
  );
}