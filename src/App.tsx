/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { AddProduct } from './pages/AddProduct';
import { SakuraPetals } from './components/SakuraPetals';

export default function App() {
  return (
    <Router>
      <SakuraPetals />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="add" element={<AddProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}
