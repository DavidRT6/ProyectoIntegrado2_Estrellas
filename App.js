import { NavigationContainer } from '@react-navigation/native';
import { ScreensProvider } from './src/screens/ScreenContext';
import EstrellasApp from './EstrellasApp';

const App = () => {
  return (
    <ScreensProvider>
      <NavigationContainer>
        <EstrellasApp />
      </NavigationContainer>
    </ScreensProvider>
  );
};

export default App;