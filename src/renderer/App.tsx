import { MemoryRouter as Router, useRoutes } from 'react-router-dom';
import './App.css';
import routes from './routes';

// 路由组件
function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
