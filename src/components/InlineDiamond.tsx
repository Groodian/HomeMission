import { Diamond } from '@mui/icons-material';

const InlineDiamond: React.FC<{
  fontSize?: 'small' | 'inherit' | 'large' | 'medium';
}> = ({ fontSize = 'small' }) => (
  <Diamond
    fontSize={fontSize}
    sx={{ verticalAlign: 'sub', color: '#29b6f6' }}
  />
);

export default InlineDiamond;
