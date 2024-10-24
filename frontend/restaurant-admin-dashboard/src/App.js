import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GlobalStyles } from "./styles/GlobalStyles";
import { lightTheme, darkTheme } from "./styles/Theme";
import { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Settings from "./pages/Settings";
import Restaurant from "./pages/Restaurant";
import Orders from "./pages/Orders"
import Menu from "./pages/Menu"
import Categories from "./pages/Categories"


const Content = styled.div`
  margin-top: 60px;
  margin-left: ${({ $isExpanded }) => ($isExpanded ? '250px' : '80px')}; 
  padding: 20px;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: ${({ $isExpanded }) => ($isExpanded ? '250px' : '80px')};
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;


function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);


  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  }

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }


  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        {isAuthenticated ? (
          <>
            <Header theme={theme} toggleTheme={toggleTheme} restaurantName="Burger place"/>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={() => setSidebarExpanded(!isSidebarExpanded)}/>

            <Content $isExpanded={isSidebarExpanded}>
              <Routes>
                
                <Route exact path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/categories" element={ <Categories />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />

              </Routes>
            </Content>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>

        )}
        
      </Router>
    </ThemeProvider>
  );
}

export default App;
