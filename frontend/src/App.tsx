import { Provider } from 'jotai';
import Dashboard from './components/Dashboard';

function App() {
  return (
    // Provider makes Jotai atoms available to all child components
    // Like Redux's <Provider store={store}> if you've seen that before
    <Provider>
      <Dashboard />
    </Provider>
  );
}

export default App;