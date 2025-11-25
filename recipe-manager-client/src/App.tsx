import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RecipeList } from './pages/RecipeList';
import { RecipeDetail } from './pages/RecipeDetail';
import { RecipeForm } from './pages/RecipeForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipeList />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="add" element={<RecipeForm />} />
          <Route path="edit/:id" element={<RecipeForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
