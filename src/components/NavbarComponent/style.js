import styled from "styled-components"

export const WrapperLabelText = styled.h4`
    color: #111;
    font-size: 13px;
    font-weight: 700;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 0.4px;
`

export const WrapperContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

export const WrapperDivider = styled.div`
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
`

/* Sort option — full width pill */
export const WrapperSortOption = styled.div`
    font-size: 13px;
    font-weight: ${(p) => (p.active ? 600 : 400)};
    color: ${(p) => (p.active ? '#9255FD' : '#444')};
    background: ${(p) => (p.active ? '#f3ecff' : 'transparent')};
    border: 1px solid ${(p) => (p.active ? '#c9a8fd' : '#e8e8e8')};
    border-radius: 6px;
    padding: 7px 10px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #c9a8fd;
        color: #9255FD;
        background: #f8f4ff;
    }
`

/* Rating filter row */
export const WrapperFilterTag = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.active ? '#c9a8fd' : '#e8e8e8')};
    background: ${(p) => (p.active ? '#f3ecff' : 'transparent')};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #c9a8fd;
        background: #f8f4ff;
    }
`

/* Price tag pill */
export const WrapperPriceTag = styled.div`
    font-size: 12px;
    font-weight: ${(p) => (p.active ? 600 : 400)};
    color: ${(p) => (p.active ? '#9255FD' : '#444')};
    background: ${(p) => (p.active ? '#f3ecff' : '#fafafa')};
    border: 1px solid ${(p) => (p.active ? '#c9a8fd' : '#e8e8e8')};
    border-radius: 20px;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.2s;
    width: fit-content;

    &:hover {
        border-color: #c9a8fd;
        color: #9255FD;
        background: #f8f4ff;
    }
`