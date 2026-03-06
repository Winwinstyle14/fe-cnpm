import styled from "styled-components"

export const WrapperPage = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
`

export const WrapperCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  overflow: hidden;
`

/* 3-column info row */
export const WrapperHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const WrapperInfoBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
`

export const WrapperLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const WrapperContentInfo = styled.div`
  .name-info {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  .info-row {
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 6px;
    line-height: 1.5;

    span {
      color: #9ca3af;
      font-size: 12px;
    }

    .highlight {
      color: #f59e0b;
      font-weight: 700;
      margin-right: 4px;
      font-size: 13px;
    }
  }

  .status-tag {
    display: inline-block;
    margin-top: 8px;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;

    &.paid {
      background: #dcfce7;
      color: #16a34a;
    }
    &.unpaid {
      background: #fef9c3;
      color: #b45309;
    }
  }
`

/* Table */
export const WrapperTableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const WrapperProductRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;

  &:hover {
    background: #fafafa;
  }

  &:last-of-type {
    border-bottom: none;
  }
`

export const WrapperNameProduct = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
`

export const WrapperCell = styled.div`
  width: 120px;
  flex-shrink: 0;
  text-align: center;
  font-size: 13px;
  color: ${p => p.discount ? '#ef4444' : p.bold ? '#111827' : '#374151'};
  font-weight: ${p => (p.bold || p.header) ? 600 : 400};
`

/* Summary */
export const WrapperSummary = styled.div`
  padding: 16px 20px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`

export const WrapperSummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  font-size: 13px;
  color: #6b7280;

  span:last-child {
    min-width: 120px;
    text-align: right;
    color: #374151;
    font-weight: 500;
  }
`

export const WrapperTotalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  padding-top: 10px;
  border-top: 1px dashed #e5e7eb;

  span:first-child {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
  }

  span:last-child {
    min-width: 120px;
    text-align: right;
    font-size: 18px;
    font-weight: 800;
    color: #6366f1;
  }
`