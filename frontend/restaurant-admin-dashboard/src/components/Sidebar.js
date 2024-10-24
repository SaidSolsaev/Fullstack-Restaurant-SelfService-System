import React from 'react';
import styled from 'styled-components';
import { FaHome, FaClipboardList, FaCircle, FaRegDotCircle, FaSignOutAlt } from 'react-icons/fa';
import { MdMenuBook, MdCategory, MdOutlineRestaurantMenu} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { IoMdSettings } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';


const SidebarContainer = styled.div`
    position: fixed;
    top: 60px;
    left: 0;
    width: ${({ $isExpanded }) => ($isExpanded ? '250px' : '80px')};
    height: calc(100vh - 60px);
    background-color: ${({ theme }) => theme.cardBackground};
    transition: width 0.3s ease;
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
    justify-content: space-between;
`;

const SidebarToggle = styled.div`
    position: fixed;
    cursor: pointer;
    align-self: flex-end;
    color: ${({theme}) => theme.textHover};
`;

const SidebarItem = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 20px 10px;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.text};
    transition: .2s ease;

    &:hover {
        color: ${({ theme }) => theme.textHover};
    }

    &.active{
        color: ${({ theme }) => theme.textHover};
    }

    svg {
        margin-right: ${({ $isExpanded }) => ($isExpanded ? '10px' : '0')};
    }

    span {
        display: ${({ $isExpanded }) => ($isExpanded ? 'inline' : 'none')};
    }
`;

const SidebarItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    jusify-content: space-between;
    align-items: center;
    margin-top: 30px;
`;

const SidebarLinks = styled.div`

`;

const LogoutItem = styled.div`
    display: flex;
    font-size: 1.3rem;
    align-items: center;
    cursor: pointer;
    transition: .2s ease;

    &:hover{
        color: red;
    }

    svg {
        margin-right: ${({ $isExpanded }) => ($isExpanded ? '10px' : '0')};
    }

    span {
        display: ${({ $isExpanded }) => ($isExpanded ? 'inline' : 'none')};
    }
`

const Sidebar = ({isExpanded, toggleSidebar}) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };


    return (
        
        <SidebarContainer $isExpanded={isExpanded}>
            <SidebarToggle onClick={() => toggleSidebar(!isExpanded)}>
                {isExpanded ? (
                    <FaCircle size={20}/>
                ) : (
                    <FaRegDotCircle size={20} />
                )}
            </SidebarToggle>

            <SidebarItemContainer>
                <SidebarLinks>
                    <SidebarItem $isExpanded={isExpanded} to="/">
                        <FaHome />
                        <span>Home</span>
                    </SidebarItem>
                    <SidebarItem $isExpanded={isExpanded} to="/orders">
                        <FaClipboardList />
                        <span>Orders</span>
                    </SidebarItem>
                    <SidebarItem $isExpanded={isExpanded} to="/categories">
                        <MdCategory />
                        <span>Categories</span>
                    </SidebarItem>
                    <SidebarItem $isExpanded={isExpanded} to="/menu">
                        <MdMenuBook />
                        <span>Menu</span>
                    </SidebarItem>
                    <SidebarItem $isExpanded={isExpanded} to="/restaurant">
                        <MdOutlineRestaurantMenu  />
                        <span>Restaurant</span>
                    </SidebarItem>
                    <SidebarItem $isExpanded={isExpanded} to="/settings">
                        <IoMdSettings   />
                        <span>Settings</span>
                    </SidebarItem>
                </SidebarLinks>
            </SidebarItemContainer>

            <SidebarItemContainer>
                <LogoutItem onClick={handleLogout} $isExpanded={isExpanded}>
                    <span>Sign Out</span>
                    <FaSignOutAlt style={{marginLeft:"10px"}}/>
                </LogoutItem>
            </SidebarItemContainer>
        </SidebarContainer>
      
    )
}

export default Sidebar