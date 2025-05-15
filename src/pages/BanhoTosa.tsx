
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { GroomingBoard } from "@/components/groomingboard/GroomingBoard";
import { useStore } from "@/context/StoreContext";

const BanhoTosa: React.FC = () => {
  return (
    <Layout activePage="banhoe-tosa" setActivePage={() => {}}>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Banho e Tosa</h1>
        <GroomingBoard />
      </div>
    </Layout>
  );
};

export default BanhoTosa;
