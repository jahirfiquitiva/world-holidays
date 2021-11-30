import { Component } from '@/components/global/component';
import { Layout } from '@/components/global/layout';
import { Home } from '@/components/home';
import { HolidaysProvider } from '@/providers/holidays';

const Index: Component = () => {
  return (
    <Layout>
      <HolidaysProvider>
        <Home />
      </HolidaysProvider>
    </Layout>
  );
};

export default Index;
