import styled from "styled-components"

/* Overall 2-col layout */
export const WrapperLayout = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 28px;
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.07);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

/* LEFT column */
export const WrapperImageCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  .image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f8f8;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #f0f0f0;
  }
`

export const WrapperBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  z-index: 2;
`

/* RIGHT column */
export const WrapperInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const WrapperName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  margin: 0;
`

export const WrapperMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .rating-val {
    font-size: 13px;
    font-weight: 600;
    color: #f59e0b;
  }

  .divider { color: #e5e7eb; }

  .sold {
    font-size: 13px;
    color: #6b7280;
  }

  .in-stock {
    font-size: 12px;
    color: #16a34a;
    font-weight: 600;
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: 4px;
  }

  .out-stock {
    font-size: 12px;
    color: #ef4444;
    font-weight: 600;
    background: #fee2e2;
    padding: 2px 8px;
    border-radius: 20px;
  }
`

export const WrapperPriceBox = styled.div`
  background: linear-gradient(135deg, #fdf4ff 0%, #f0f9ff 100%);
  border: 1px solid #e9d5ff;
  border-radius: 10px;
  padding: 16px 20px;

  .price-main {
    font-size: 30px;
    font-weight: 800;
    color: #ef4444;
    line-height: 1;
  }

  .price-discount {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }

  .original {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: line-through;
  }

  .save {
    font-size: 12px;
    color: #7c3aed;
    font-weight: 600;
    background: #ede9fe;
    padding: 2px 8px;
    border-radius: 20px;
  }
`

export const WrapperAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4b5563;
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #f0f0f0;

  .address {
    font-weight: 600;
    color: #111827;
    text-decoration: underline dotted;
  }

  .change {
    color: #6366f1;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    &:hover { text-decoration: underline; }
  }
`

export const WrapperFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

export const WrapperFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
`

/* Quantity control */
export const WrapperQtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
`

export const WrapperQtyBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: ${p => p.disabled ? '#f9fafb' : '#fff'};
  color: ${p => p.disabled ? '#d1d5db' : '#374151'};
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
`

export const WrapperQtyInput = styled.input`
  width: 48px;
  height: 36px;
  border: none;
  border-left: 1.5px solid #e5e7eb;
  border-right: 1.5px solid #e5e7eb;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  outline: none;
  background: #fff;

  /* Hide arrows */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; }
`

// Alias giữ tương thích với OrderPage đang import tên cũ
export const WrapperInputNumber = WrapperQtyInput

/* Action buttons */
export const WrapperActions = styled.div`
  display: flex;
  gap: 12px;

  .btn-buy {
    flex: 1;
    height: 48px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239,68,68,0.4);
    }
  }

  .btn-later {
    flex: 1;
    height: 48px;
    background: #fff;
    color: #6366f1;
    border: 1.5px solid #6366f1;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;

    &:hover {
      background: #f5f3ff;
      transform: translateY(-2px);
    }
  }
`