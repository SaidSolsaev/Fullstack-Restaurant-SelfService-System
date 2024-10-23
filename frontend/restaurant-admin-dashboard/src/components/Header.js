import React from 'react';
import styled from 'styled-components'
import { FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: ${({ theme }) => theme.cardBackground};
    box-shadow: ${({ theme }) => theme.boxShadow};
    color: ${({ theme }) => theme.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    z-index: 1000;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
`;

const Menu = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const ThemeSwitcher = styled.div`
    margin-right: 20px;
    cursor: pointer;
`;

const ProfileIcon = styled.div`
    position: relative;
`;



const Header = ({restaurantName, toggleTheme, theme}) => {
    

    return (
        <HeaderContainer>
            <Logo>{restaurantName}</Logo>

            <Menu>
                <ThemeSwitcher onClick={toggleTheme}>
                    {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                </ThemeSwitcher>

                <ProfileIcon>
                    <FaUserCircle size={30} />
                </ProfileIcon>

            </Menu>
        </HeaderContainer>
    )
}

export default Header