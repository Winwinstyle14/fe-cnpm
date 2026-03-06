import { Col } from "antd"
import styled from "styled-components"

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(188px, 1fr));
    gap: 14px;
    width: 100%;

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`

export const WrapperNavbar = styled.div`
    width: 220px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    height: fit-content;
    position: sticky;
    top: 16px;
`