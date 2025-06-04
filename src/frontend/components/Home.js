import { useState, useEffect, useCallback } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const loadMarketplaceItems = useCallback(async () => {
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(item.itemId)

        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }, [marketplace, nft])

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }

  useEffect(() => {
    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)

    loadMarketplaceItems()
  }, [loadMarketplaceItems])

  if (loading) return (
    <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
      <h2 className="text-center">Loading...</h2>
    </main>
  )

  return (
    <div style={{ backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
      {items.length > 0 ? (
        <div className="container py-5">
          <h2 className="text-center mb-4" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>Explore NFTs</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {items.map((item, idx) => (
              <Col key={idx} className="d-flex align-items-stretch">
                <Card style={{ borderRadius: '20px', backgroundColor: '#00509d', color: '#fff' }}>
                  <Card.Img variant="top" src={item.image} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '200px', objectFit: 'cover' }} />
                  <Card.Body style={{ fontFamily: 'Poppins' }}>
                    <Card.Title style={{ fontWeight: '600' }}>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0 p-3">
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="light" size="lg" style={{ fontWeight: '600', fontFamily: 'Poppins' }}>
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
          <h2 className="text-center">No listed assets</h2>
        </main>
      )}
    </div>
  )
}

export default Home
