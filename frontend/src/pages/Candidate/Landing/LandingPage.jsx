import MainLayout from "../../../components/layout/MainLayout";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Statistics from "./Statistics";

const LandingPage = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <Statistics />
    </MainLayout>
  );
};

export default LandingPage;