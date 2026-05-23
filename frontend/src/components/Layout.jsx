import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Menu, MenuItem, Badge, Tooltip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useEffect, useState } from 'react';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Cases', icon: <FolderIcon />, path: '/cases' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('justice-theme') !== 'light');

  useEffect(() => {
    const mode = darkMode ? 'dark' : 'light';
    document.body.dataset.colorMode = mode;
    localStorage.setItem('justice-theme', mode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const drawer = (
    <Box 
      sx={{ 
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
        height: '100%',
        pt: 2,
        overflow: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' }
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          px: 3, 
          py: 2,
          fontWeight: 700,
          fontSize: '1.1rem',
          background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        ⚖️ Justice Platform
      </Typography>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{ 
              mx: 0.5,
              borderRadius: 2,
              mb: 1,
              py: 1.5,
              px: 2,
              background: location.pathname === item.path 
                ? 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))'
                : 'transparent',
              borderLeft: location.pathname === item.path ? '3px solid #00d4ff' : '3px solid transparent',
              '&:hover': {
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#00d4ff' : '#666',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{ 
                color: location.pathname === item.path ? '#fff' : '#aaa',
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: '0.95rem'
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: darkMode ? '#0a0a0f' : '#f4f7fb', color: darkMode ? '#fff' : '#111827' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: darkMode ? 'rgba(15, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
          boxShadow: darkMode ? '0 4px 30px rgba(0, 0, 0, 0.3)' : '0 4px 24px rgba(15, 23, 42, 0.08)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton onClick={toggleSidebar} sx={{ mr: 2, color: darkMode ? '#fff' : '#111827' }}>
              {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </motion.div>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: '1.2rem'
            }}
          >
            Secure Access to Justice
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dark / Light Mode Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton
                  onClick={() => setDarkMode((value) => !value)}
                  sx={{
                    color: darkMode ? '#facc15' : '#7c3aed',
                    bgcolor: darkMode ? 'rgba(250,204,21,0.08)' : 'rgba(124,58,237,0.08)',
                    border: darkMode ? '1px solid rgba(250,204,21,0.18)' : '1px solid rgba(124,58,237,0.18)',
                    '&:hover': {
                      color: darkMode ? '#fde68a' : '#5b21b6',
                      bgcolor: darkMode ? 'rgba(250,204,21,0.16)' : 'rgba(124,58,237,0.16)'
                    }
                  }}
                  aria-label="toggle dark mode"
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* Notification Bell */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={handleNotificationClick}
                sx={{ 
                  color: '#888',
                  '&:hover': { color: '#00d4ff', bgcolor: 'rgba(0,212,255,0.1)' }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </motion.div>

            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  background: 'rgba(20, 20, 35, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  mt: 1,
                  minWidth: 280
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>Notifications</Typography>
              </Box>
              <MenuItem sx={{ color: '#aaa', py: 1.5 }}>
                <ListItemIcon><NotificationsIcon sx={{ color: '#00d4ff', fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="New case assigned" secondary="Case #1234 has been assigned to you" />
              </MenuItem>
              <MenuItem sx={{ color: '#aaa', py: 1.5 }}>
                <ListItemIcon><NotificationsIcon sx={{ color: '#10b981', fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="Case closed" secondary="Case #1230 has been closed" />
              </MenuItem>
              <MenuItem sx={{ color: '#aaa', py: 1.5 }}>
                <ListItemIcon><NotificationsIcon sx={{ color: '#ffc107', fontSize: 20 }} /></ListItemIcon>
                <ListItemText primary="New message" secondary="You have a new message from the judge" />
              </MenuItem>
            </Menu>

            {/* Profile Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleProfileClick}
                sx={{ 
                  color: '#fff',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  ml: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(0,212,255,0.3)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PersonIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '0.9rem' }}>
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#00d4ff', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Button>
            </motion.div>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              PaperProps={{
                sx: {
                  background: 'rgba(20, 20, 35, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  mt: 1,
                  minWidth: 200
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>
                  My Profile
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem onClick={handleProfileClose} sx={{ color: '#fff', py: 1.5 }}>
                <ListItemIcon><PersonIcon sx={{ color: '#00d4ff' }} /></ListItemIcon>
                <ListItemText primary="View Profile" />
              </MenuItem>
              <MenuItem onClick={handleProfileClose} sx={{ color: '#fff', py: 1.5 }}>
                <ListItemIcon><SettingsIcon sx={{ color: '#888' }} /></ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <MenuItem onClick={() => { handleProfileClose(); handleLogout(); }} sx={{ color: '#ff4757', py: 1.5 }}>
                <ListItemIcon><LogoutIcon sx={{ color: '#ff4757' }} /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: drawerWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', height: '100%', zIndex: 1200 }}
          >
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  background: 'transparent',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden'
                },
              }}
              open
            >
              <Box sx={{ pt: 9, overflow: 'hidden' }}>{drawer}</Box>
            </Drawer>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 1,
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s ease',
          minHeight: '100vh'
        }}
      >
        <Box sx={{ pt: 7 }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
