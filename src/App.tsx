import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Menu from '@mui/icons-material/Menu';
import { Portal } from '@mui/material';

function App() {
  return (<Box position={'relative'}>
    <Fab color="inherit" aria-label="add" sx={{ position: 'absolute', top: '10px', left: '10px' }}>
      <Menu />
      <Portal container={document.body}>
        <Box className='fab-menu'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MUI
          </Typography>
        </Box>
      </Portal>
    </Fab>
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App example with TypeScript
        </Typography>
      </Box>
    </Container>
  </Box>
  );
}

export default App;
