import { Row } from "antd"
import { Link } from "react-router-dom"
import styled from "styled-components"

export const WrapperHeader = styled(Row)`
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
  margin: 0 auto;
  padding: 12px 16px;
`

/* ===== LOGO ===== */
export const WrapperTextHeader = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  .logo-icon {
    display: flex;
    align-items: center;
    filter: drop-shadow(0 0 8px rgba(34,211,238,0.5));
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
    gap: 1px;
  }

  .logo-main {
    font-size: 17px;
    font-weight: 800;
    color: #f0fdf4;
    letter-spacing: 0.5px;
    text-shadow: 0 0 20px rgba(34,197,94,0.4);
  }

  .logo-sub {
    font-size: 9px;
    font-weight: 700;
    color: #22d3ee;
    letter-spacing: 3px;
    opacity: 0.85;
  }

  &:hover .logo-main {
    color: #86efac;
  }
`

/* ===== SEARCH BAR ===== */
export const WrapperSearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid ${p => p.focused ? 'rgba(34,197,94,0.6)' : 'rgba(255,255,255,0.12)'};
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${p => p.focused ? '0 0 0 3px rgba(34,197,94,0.12)' : 'none'};

  .search-input {
    flex: 1;
    height: 42px;
    padding: 0 16px;
    background: transparent;
    border: none;
    outline: none;
    color: #f0fdf4;
    font-size: 14px;

    &::placeholder {
      color: rgba(255,255,255,0.35);
    }
  }

  .search-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 42px;
    padding: 0 20px;
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    border: none;
    border-left: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
    letter-spacing: 0.3px;

    &:hover {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`

/* ===== ACCOUNT ===== */
export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #e5e7eb;
  gap: 10px;
  max-width: 200px;

  .avatar-wrap {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .user-name {
    font-size: 13px;
    font-weight: 500;
    color: #d1fae5;
  }
`

export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
  margin: 0;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  border-radius: 6px;
  transition: all 0.15s;

  &:hover {
    background: #f0fdf4;
    color: #16a34a;
  }
`