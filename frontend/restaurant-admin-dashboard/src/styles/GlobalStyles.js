import {createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.borderColor};
        border-radius: 10px; 
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: ${({ theme }) => theme.secondaryText}; 
    }

    ::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.background};
    }

    /* Body and General Text Styling */
    body {
        font-family: 'Roboto', sans-serif;
        background-color: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
        transition: all 0.25s linear;
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${({ theme }) => theme.text};
    }

    p {
        color: ${({ theme }) => theme.secondaryText};
    }

    /* Container */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;

        @media (max-width: 1200px) {
            padding: 15px;
        }

        @media (max-width: 768px) {
            padding: 10px;
        }

        @media (max-width: 480px) {
            padding: 5px;
        }
    }

    /* Buttons */
    button {
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: bold;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
        
        /* Primary Button (Default Style) */
        background-color: ${({ theme }) => theme.primaryButton};
        color: ${({ theme }) => theme.primaryButtonText};

        &:hover {
            background-color: ${({ theme }) => theme.primaryButtonHover || '#45a049'};
        }

        @media (max-width: 768px) {
            padding: 8px 18px;
            font-size: 0.9rem;
        }

        @media (max-width: 480px) {
            padding: 6px 16px;
            font-size: 0.8rem;
        }
    }

    /* Secondary Button */
    .secondary-button {
        background-color: ${({ theme }) => theme.secondaryButton};
        color: ${({ theme }) => theme.secondaryButtonText};

        &:hover {
            background-color: ${({ theme }) => theme.secondaryButtonHover || '#e0e0e0'};
        }
    }

    /* Alerts (Error, Success, Warning, Info) */
    .error-message {
        color: ${({ theme }) => theme.error};
        font-weight: bold;
    }

    .success-message {
        color: ${({ theme }) => theme.success};
        font-weight: bold;
    }

    .warning-message {
        color: ${({ theme }) => theme.warning};
        font-weight: bold;
    }

    .info-message {
        color: ${({ theme }) => theme.info};
        font-weight: bold;
    }
    
    .error-message,
    .success-message,
    .warning-message,
    .info-message {

        @media (max-width: 768px) {
            font-size: 0.9rem;
        }

        @media (max-width: 480px) {
            font-size: 0.8rem;
        }
    }


    /* Input Styling */
    input, textarea {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid ${({ theme }) => theme.borderColor};
        border-radius: 5px;
        background-color: ${({ theme }) => theme.cardBackground};
        color: ${({ theme }) => theme.text};
        transition: border 0.2s ease;

        &:focus {
            border-color: ${({ theme }) => theme.primaryButton};
            outline: none;
        }

        @media (max-width: 768px) {
            padding: 8px;
        }

        @media (max-width: 480px) {
            padding: 6px;
        }
    }


    .card {
        background-color: ${({ theme }) => theme.cardBackground};
        box-shadow: ${({ theme }) => theme.boxShadow};
        border-radius: 10px;
        padding: 20px;

        @media (max-width: 768px) {
            padding: 15px;
        }

        @media (max-width: 480px) {
            padding: 10px;
        }
    }

    h1 {
        font-size: 2rem;

        @media (max-width: 768px) {
            font-size: 1.5rem;
        }

        @media (max-width: 480px) {
            font-size: 1.25rem;
        }
    }

    h2 {
        font-size: 1.75rem;

        @media (max-width: 768px) {
            font-size: 1.25rem;
        }

        @media (max-width: 480px) {
            font-size: 1rem;
        }
    }

    p {
        font-size: 1rem;

        @media (max-width: 768px) {
            font-size: 0.9rem;
        }

        @media (max-width: 480px) {
            font-size: 0.8rem;
        }
    }
`;