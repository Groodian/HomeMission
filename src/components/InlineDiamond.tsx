import { Diamond } from '@mui/icons-material';

const InlineDiamond: React.FC<{
  fontSize?: 'small' | 'inherit' | 'large' | 'medium';
  verticalAlign?:
    | 'baseline'
    | 'sub'
    | 'super'
    | 'text-top'
    | 'text-bottom'
    | 'middle'
    | 'top'
    | 'bottom';
}> = ({ fontSize = 'small', verticalAlign = 'sub' }) => (
  <Diamond fontSize={fontSize} sx={{ verticalAlign, color: '#29b6f6' }} />
);

export default InlineDiamond;
