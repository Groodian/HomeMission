import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  outlinedInputClasses,
  Select,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

const LanguageSelect: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const router = useRouter();
  return (
    <Box sx={{ minWidth: 140 }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="language-select-label"
          sx={{
            color: (theme) => `${theme.palette.text.primary} !important`,
          }}
        >
          {t('language')}
        </InputLabel>
        <Select
          id="language-select"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.background.default
                : 'none',
            [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: 'inherit',
              },
          }}
          labelId="language-select-label"
          label={t('language')}
          value={router.locale}
          onChange={(event) => {
            router.push(router.route, router.route, {
              locale: event.target.value,
            });
          }}
        >
          <MenuItem value="de">
            <Box component="span" sx={{ mr: 2 }}>
              <Image
                width="16"
                height="12"
                src={`https://flagcdn.com/16x12/de.png`}
                alt=""
              />
            </Box>
            Deutsch
          </MenuItem>
          <MenuItem value="en">
            <Box component="span" sx={{ mr: 2 }}>
              <Image
                width="16"
                height="12"
                src={`https://flagcdn.com/16x12/us.png`}
                alt=""
              />
            </Box>
            English
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelect;
