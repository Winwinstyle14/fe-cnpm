import { Radio } from "antd"
import styled from "styled-components"

export const WrapperLeft = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const WrapperRight = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 16px;
`

export const WrapperInfo = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
`

export const WrapperTotal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
`

export const WrapperLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const WrapperRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const WrapperOptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid ${p => p.selected ? '#6366f1' : '#e5e7eb'};
  background: ${p => p.selected ? '#f5f3ff' : '#fff'};
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: #a5b4fc;
    background: #fafafe;
  }
`