
import React from "react";
import { Layout } from "@/components/Layout";
import { GroomingBoard } from "@/components/groomingboard/GroomingBoard";

const BanhoTosa: React.FC = () => {
  return (
    <Layout activePage="banho-tosa" setActivePage={() => {}}>
      <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
        <h1 className="text-xl md:text-2xl font-bold">Banho e Tosa</h1>
        <GroomingBoard />
      </div>
    </Layout>
  );
};

export default BanhoTosa;
