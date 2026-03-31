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
import { InitialDataAdder } from './components/InitialDataAdder';

export default function App() {
  return (
    <Router>
      <InitialDataAdder />
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
