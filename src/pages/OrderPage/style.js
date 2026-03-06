import { Checkbox } from "antd"
import styled from "styled-components"

export const WrapperLeft = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`

export const WrapperStyleHeaderDelivery = styled.div`
  padding: 4px 0 0;
`

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  gap: 12px;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 3px 12px rgba(0,0,0,0.09);
  }
`

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
`

export const WrapperInfo = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
`

export const WrapperTotal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  width: 100%;
`

export const CustomCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #6366f1;
    border-color: #6366f1;
  }
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #6366f1;
  }
`