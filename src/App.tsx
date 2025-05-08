
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import VehicleList from './components/VehicleList';
import AddVehicle from './components/AddVehicle';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
        <Routes>
          <Route path="/" element={<VehicleList />} />
          <Route path="/add" element={<AddVehicle />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
