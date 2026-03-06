import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountBadge, WrapperPriceRow, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()

    return (
        <WrapperCardStyle onClick={() => navigate(`/product-details/${id}`)}>
            {/* Image */}
            <div className="card-image-wrap">
                <img alt={name} src={image} className="card-image" />
                <img src={logo} alt="official" className="card-logo" />
                {discount > 0 && (
                    <WrapperDiscountBadge>-{discount}%</WrapperDiscountBadge>
                )}
            </div>

            {/* Body */}
            <div className="card-body">
                <StyleNameProduct title={name}>{name}</StyleNameProduct>

                <WrapperReportText>
                    <StarFilled style={{ fontSize: '11px', color: '#faad14', marginRight: '3px' }} />
                    <span style={{ fontWeight: 500, color: '#555' }}>{rating}</span>
                    <span className="divider">|</span>
                    <WrapperStyleTextSell>Đã bán {selled || 1000}+</WrapperStyleTextSell>
                </WrapperReportText>

                <WrapperPriceRow>
                    <span className="price">{convertPrice(price)}</span>
                </WrapperPriceRow>
            </div>
        </WrapperCardStyle>
    )
}

export default CardComponent