import React from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({ page: 0, limit: 12, total: 1 })

    // Filter state
    const [filters, setFilters] = useState({
        minRating: 0,
        priceRange: null,   // null | [min, max]
        sortBy: '',         // 'price_asc' | 'price_desc' | 'sold' | ''
    })

    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setProducts(res?.data)
            setPanigate(prev => ({ ...prev, total: res?.totalPage }))
        }
        setLoading(false)
    }

    useEffect(() => {
        if (state) fetchProductType(state, panigate.page, panigate.limit)
    }, [state, panigate.page, panigate.limit])

    const onChange = (current, pageSize) => {
        setPanigate(prev => ({ ...prev, page: current - 1, limit: pageSize }))
    }

    // Apply filters + search
    const filteredProducts = products
        ?.filter((pro) => {
            if (searchDebounce && !pro?.name?.toLowerCase().trim().includes(searchDebounce.toLowerCase().trim())) return false
            if (filters.minRating > 0 && (pro?.rating ?? 0) < filters.minRating) return false
            if (filters.priceRange) {
                const [min, max] = filters.priceRange
                if (pro?.price < min || pro?.price > max) return false
            }
            return true
        })
        ?.sort((a, b) => {
            if (filters.sortBy === 'price_asc') return a.price - b.price
            if (filters.sortBy === 'price_desc') return b.price - a.price
            if (filters.sortBy === 'sold') return (b.selled ?? 0) - (a.selled ?? 0)
            return 0
        })

    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
                <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '16px' }}>
                    <Row gutter={16} style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                        {/* Sidebar */}
                        <WrapperNavbar>
                            <NavBarComponent filters={filters} setFilters={setFilters} />
                        </WrapperNavbar>

                        {/* Content */}
                        <Col flex="1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Result count + sort hint */}
                            <div style={{
                                background: '#fff', borderRadius: '10px', padding: '12px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                                <span style={{ fontSize: '14px', color: '#555' }}>
                                    <span style={{ fontWeight: 600, color: '#222' }}>{filteredProducts?.length ?? 0}</span> sản phẩm
                                    {state ? <span style={{ color: '#9255FD', fontWeight: 500 }}> · {state}</span> : ''}
                                </span>
                                {(filters.minRating > 0 || filters.priceRange || filters.sortBy) && (
                                    <span
                                        onClick={() => setFilters({ minRating: 0, priceRange: null, sortBy: '' })}
                                        style={{ fontSize: '12px', color: '#9255FD', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                        Xóa bộ lọc ×
                                    </span>
                                )}
                            </div>

                            {/* Products grid */}
                            <WrapperProducts>
                                {filteredProducts?.map((product) => (
                                    <CardComponent
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        rating={product.rating}
                                        type={product.type}
                                        selled={product.selled}
                                        discount={product.discount}
                                        id={product._id}
                                    />
                                ))}
                                {filteredProducts?.length === 0 && !loading && (
                                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', width: '100%', fontSize: '14px' }}>
                                        Không tìm thấy sản phẩm phù hợp
                                    </div>
                                )}
                            </WrapperProducts>

                            {/* Pagination */}
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px' }}>
                                <Pagination
                                    current={panigate.page + 1}
                                    total={panigate?.total}
                                    pageSize={panigate.limit}
                                    onChange={onChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage