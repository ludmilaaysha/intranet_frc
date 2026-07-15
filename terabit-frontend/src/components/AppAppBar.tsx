import * as React from 'react';
import { useNavigate } from 'react-router';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from './../shared-theme/ColorModeIconDropdown';
import { SitemarkIcon } from './CustomIcons';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import List from '@mui/material/List';
import CastConnectedRoundedIcon from '@mui/icons-material/CastConnectedRounded';
import { useAuth } from "../context/AuthContext";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleAnchorClick = (sectionId: string) => () => {
    navigate(`#${sectionId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <SitemarkIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="text"
                startIcon={<HomeRoundedIcon />}
                color="info"
                size="small"
                onClick={handleAnchorClick('home')}
              >
                Início
              </Button>
              {/* <Button
                variant="text"
                startIcon={<CastConnectedRoundedIcon />}
                color="info"
                size="small"
                onClick={handleAnchorClick('wan')}
              >
                WAN
              </Button> */}
              <Button
                variant="text"
                startIcon={<LiveTvRoundedIcon />}
                color="info"
                size="small"
                onClick={handleAnchorClick('channels')}
              >
                Canais
              </Button>
              {user?.role === "admin" && (
                <Button
                  variant="text"
                  startIcon={<AdminPanelSettingsRoundedIcon />}
                  color="info"
                  size="small"
                  onClick={() => navigate('/admin')}
                >
                  Administrador
                </Button>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
          <Button
            color="primary"
            variant="contained"
            endIcon={<LogoutRoundedIcon />}
            size="small"
            onClick={logout}
          >
            Sair
          </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    top: 'var(--template-frame-height, 0px)',
                  },
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <List>
                  <Button
                    variant="text"
                    startIcon={<HomeRoundedIcon />}
                    color="info"
                    size="small"
                    onClick={() => {
                      toggleDrawer(false)();
                      handleAnchorClick('home')();
                    }}
                  >
                    Início
                  </Button>
                  {/* <Button
                    variant="text"
                    startIcon={<CastConnectedRoundedIcon />}
                    color="info"
                    size="small"
                    onClick={() => {
                      toggleDrawer(false)();
                      handleAnchorClick('wan')();
                    }}
                  >
                    WAN
                  </Button> */}
                  {/* <Button variant="text" startIcon={<WhatshotRoundedIcon />} color="info" size="small">
                    Recomendados
                  </Button> */}
                  <Button
                    variant="text"
                    startIcon={<LiveTvRoundedIcon />}
                    color="info"
                    size="small"
                    onClick={() => {
                      toggleDrawer(false)();
                      handleAnchorClick('channels')();
                    }}
                  >
                    Canais
                  </Button>
                  {user?.role === "admin" && (
                    <Button
                      variant="text"
                      startIcon={<AdminPanelSettingsRoundedIcon />}
                      color="info"
                      size="small"
                      onClick={() => navigate("/admin")}
                    >
                      Administrador
                    </Button>
                  )}
                </List>

                <Divider sx={{ my: 3 }} />

                <Button color="primary" endIcon={<LogoutRoundedIcon />} variant="outlined" fullWidth onClick={logout}>
                  Sair
                </Button>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}