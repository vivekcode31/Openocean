import { useState, useEffect, useCallback } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])

  const loadPurchasedItems = useCallback(async () => {
    const filter = marketplace.filters.Bought(null, null, null, null, null, account)
    const results = await marketplace.queryFilter(filter)

    const purchases = await Promise.all(results.map(async i => {
      i = i.args
      const uri = await nft.tokenURI(i.tokenId)
      const response = await fetch(uri)
      const metadata = await response.json()
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      return {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
    }))

    setPurchases(purchases)
    setLoading(false)
  }, [account, marketplace, nft])

  useEffect(() => {
    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)

    loadPurchasedItems()
  }, [loadPurchasedItems])

  if (loading) {
    return (
      <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
        <h2 className="text-center">Loading...</h2>
      </main>
    )
  }

  return (
    <div style={{ backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
      {purchases.length > 0 ? (
        <div className="container py-5">
          <h2 className="text-white text-center mb-4" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>My Purchases</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {purchases.map((item, idx) => (
              <Col key={idx} className="d-flex align-items-stretch">
                <Card style={{ borderRadius: '20px', backgroundColor: '#00509d', color: '#fff' }}>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    style={{
                      borderTopLeftRadius: '20px',
                      borderTopRightRadius: '20px',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontFamily: 'Poppins' }}>{item.name}</Card.Title>
                    <Card.Text style={{ fontFamily: 'Poppins' }}>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0 p-3">
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
          <h2 className="text-center">No purchases</h2>
        </main>
      )}
    </div>
  )
}
