import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  overflow-x: auto;
  flex-wrap: nowrap;
  padding: 4px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

/* Row chứa slider + 2 cột quảng cáo */
export const WrapperSliderSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`

/* Cột quảng cáo bên trái / phải */
export const WrapperAdBanner = styled.div`
  width: 160px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 1024px) {
    display: none;   /* ẩn trên màn nhỏ để slider không bị chật */
  }
`

export const WrapperButtonMore = styled(ButtonComponent)`
  transition: all 0.25s ease;
  background: #fff;

  &:hover:not(:disabled) {
    background: #9255FD;
    border-color: #9255FD !important;
    box-shadow: 0 4px 14px rgba(146, 85, 253, 0.35);
    transform: translateY(-1px);
    span { color: #fff !important; }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`