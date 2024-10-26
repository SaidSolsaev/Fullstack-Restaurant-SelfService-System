import React from 'react'
import styled from 'styled-components';
import {FaSearch} from "react-icons/fa";

const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 300px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 15px 15px;
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    outline: none;
    padding-right: 40px;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
`;

const Searchbar = ({placeholder = "Search...", onSearch}) => {
    const handleSearch = (e) => {
        onSearch(e.target.value)
    };


    return (
        <SearchWrapper>
            <SearchInput type="text" placeholder={placeholder} onChange={handleSearch} />
            <SearchIcon />
        </SearchWrapper>
    )
}

export default Searchbar