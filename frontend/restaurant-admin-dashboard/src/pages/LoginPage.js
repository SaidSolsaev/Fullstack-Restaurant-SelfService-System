import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {loginUser} from "../redux/actions/authActions"
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const {loading, error, isAuthenticated} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
        console.log(isAuthenticated)
    }, [isAuthenticated, navigate])

    
    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <LoginTitle>Login</LoginTitle>

                <LoginInput 
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <LoginInput 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <LoginButton type='submit' disabled={loading}>
                    {loading ? 'Logging In...' : 'Login'}
                </LoginButton>

                {error && <ErrorMessage>{error}</ErrorMessage>}
            </LoginForm>

        </LoginContainer>
    )
}

export default LoginPage


const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: ${({ theme }) => theme.body};
`;

const LoginForm = styled.form`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 40px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    max-width: 400px;
    width: 100%;
    text-align: center;

    @media (max-width: 768px) {
        padding: 30px;
    }

    @media (max-width: 480px) {
        padding: 20px;
    }
`;

const LoginTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
`;

const LoginInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 5px;
    background-color: ${({ theme }) => theme.cardBackground};
    color: ${({ theme }) => theme.text};

    &:focus {
        border-color: ${({ theme }) => theme.primaryButton};
        outline: none;
    }
`;

const LoginButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: ${({ theme }) => theme.primaryButton};
    color: ${({ theme }) => theme.primaryButtonText};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:disabled {
        background-color: ${({ theme }) => theme.secondaryButton};
    }

    &:hover {
        background-color: ${({ theme }) => theme.primaryButtonHover || '#45a049'};
    }
`;

const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.error};
    font-weight: bold;
`;
