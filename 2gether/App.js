import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<StatusBar style='light' backgroundColor='#4285F4' />
				<AppNavigator />
			</AuthProvider>
		</SafeAreaProvider>
	);
}
