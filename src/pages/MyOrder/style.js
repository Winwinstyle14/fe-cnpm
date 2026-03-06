import styled from "styled-components"

export const WrapperContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
`

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const WrapperItemOrder = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  }
`

export const WrapperStatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;

  ${p => p.delivered !== undefined && `
    background: ${p.delivered ? '#dcfce7' : '#fef9c3'};
    color: ${p.delivered ? '#16a34a' : '#92400e'};
  `}

  ${p => p.paid !== undefined && `
    background: ${p.paid ? '#dbeafe' : '#fee2e2'};
    color: ${p.paid ? '#1d4ed8' : '#b91c1c'};
  `}
`

export const WrapperProductRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
`

export const WrapperFooterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f0f0f0;
`