import { Rate } from 'antd'
import React from 'react'
import { WrapperContent, WrapperDivider, WrapperFilterTag, WrapperLabelText, WrapperPriceTag, WrapperSortOption } from './style'

const PRICE_RANGES = [
    { label: 'Dưới 100k', value: [0, 100000] },
    { label: '100k – 300k', value: [100000, 300000] },
    { label: '300k – 1 triệu', value: [300000, 1000000] },
    { label: '1 triệu – 5 triệu', value: [1000000, 5000000] },
    { label: 'Trên 5 triệu', value: [5000000, Infinity] },
]

const SORT_OPTIONS = [
    { label: 'Phổ biến nhất', value: 'sold' },
    { label: 'Giá thấp → cao', value: 'price_asc' },
    { label: 'Giá cao → thấp', value: 'price_desc' },
]

const RATING_OPTIONS = [5, 4, 3]

const NavBarComponent = ({ filters = {}, setFilters = () => {} }) => {
    const togglePrice = (range) => {
        const isSame = JSON.stringify(filters.priceRange) === JSON.stringify(range)
        setFilters(prev => ({ ...prev, priceRange: isSame ? null : range }))
    }

    const toggleSort = (val) => {
        setFilters(prev => ({ ...prev, sortBy: prev.sortBy === val ? '' : val }))
    }

    const toggleRating = (val) => {
        setFilters(prev => ({ ...prev, minRating: prev.minRating === val ? 0 : val }))
    }

    return (
        <div>
            {/* Sắp xếp */}
            <WrapperLabelText>Sắp xếp</WrapperLabelText>
            <WrapperContent>
                {SORT_OPTIONS.map((opt) => (
                    <WrapperSortOption
                        key={opt.value}
                        active={filters.sortBy === opt.value ? 1 : 0}
                        onClick={() => toggleSort(opt.value)}
                    >
                        {opt.label}
                    </WrapperSortOption>
                ))}
            </WrapperContent>

            <WrapperDivider />

            {/* Đánh giá */}
            <WrapperLabelText>Đánh giá</WrapperLabelText>
            <WrapperContent>
                {RATING_OPTIONS.map((star) => (
                    <WrapperFilterTag
                        key={star}
                        active={filters.minRating === star ? 1 : 0}
                        onClick={() => toggleRating(star)}
                    >
                        <Rate disabled defaultValue={star} style={{ fontSize: '11px', color: '#faad14' }} />
                        <span style={{ fontSize: '12px', color: '#555', marginLeft: '4px', whiteSpace: 'nowrap' }}>
                            {star === 5 ? '5 sao' : `Từ ${star} sao`}
                        </span>
                    </WrapperFilterTag>
                ))}
            </WrapperContent>

            <WrapperDivider />

            {/* Khoảng giá */}
            <WrapperLabelText>Khoảng giá</WrapperLabelText>
            <WrapperContent>
                {PRICE_RANGES.map((opt) => (
                    <WrapperPriceTag
                        key={opt.label}
                        active={JSON.stringify(filters.priceRange) === JSON.stringify(opt.value) ? 1 : 0}
                        onClick={() => togglePrice(opt.value)}
                    >
                        {opt.label}
                    </WrapperPriceTag>
                ))}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent