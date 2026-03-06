import { Upload } from "antd"
import styled from "styled-components"

export const WrapperContentProfile = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const WrapperUploadFile = styled(Upload)`
  .ant-upload {
    display: block;
  }
  .ant-upload-list {
    display: none;
  }
`