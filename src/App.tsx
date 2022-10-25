import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SlateEditor from 'components/slateEditor';

function App() {
  return (<Box position={'relative'}>
    <Container>
      <Box sx={{ py: 4 }}>
        <SlateEditor />
      </Box>
    </Container>
  </Box>
  );
}

export default App;
