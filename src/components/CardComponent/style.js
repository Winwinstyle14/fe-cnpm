import styled from "styled-components";

export const WrapperCardStyle = styled.div`
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    display: flex;
    flex-direction: column;
    width: 100%;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    /* ---- Image wrapper ---- */
    .card-image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background: #f8f8f8;
        overflow: hidden;
    }

    .card-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 12px;
        transition: transform 0.25s ease;
    }

    &:hover .card-image {
        transform: scale(1.05);
    }

    .card-logo {
        width: 60px;
        height: auto;
        position: absolute;
        top: 0;
        left: 0;
        border-top-left-radius: 10px;
    }

    /* ---- Body ---- */
    .card-body {
        padding: 10px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
    }
`

export const StyleNameProduct = styled.div`
    font-size: 13px;
    font-weight: 400;
    color: #222;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 36px;
`

export const WrapperReportText = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;

    .divider {
        color: #ddd;
        margin: 0 2px;
    }
`

export const WrapperStyleTextSell = styled.span`
    font-size: 11px;
    color: #999;
`

export const WrapperPriceRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;

    .price {
        color: #ee4d2d;
        font-size: 15px;
        font-weight: 700;
    }
`

export const WrapperDiscountBadge = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ee4d2d;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1.4;
`