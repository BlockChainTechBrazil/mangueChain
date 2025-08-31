import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./components/About";

import HowToDonate from "./components/HowToDonate";
import Impact from "./components/Impact";
import Partners from "./components/Partners";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";


const Router: React.FC = () => (
  <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/como-doar" element={<HowToDonate />} />
      <Route path="/impacto" element={<Impact />} />
      <Route path="/parceiros" element={<Partners />} />
      <Route path="/campanhas" element={<Campaigns />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
