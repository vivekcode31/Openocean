import { useState, useEffect, useCallback } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

function renderSoldItems(items) {
  return (
    <>
      <h2 className="text-white mt-4" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>Sold</h2>
      <Row xs={1} md={2} lg={3} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="d-flex align-items-stretch">
            <Card style={{ borderRadius: '20px', backgroundColor: '#003c7a', color: '#fff' }}>
              <Card.Img variant="top" src={item.image} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '200px', objectFit: 'cover' }} />
              <Card.Footer className="bg-transparent border-top-0 p-3">
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Received {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])

  const loadListedItems = useCallback(async () => {
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(i.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(i.itemId)

        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        if (i.sold) soldItems.push(item)
      }
    }
    setListedItems(listedItems)
    setSoldItems(soldItems)
    setLoading(false)
  }, [account, marketplace, nft])

  useEffect(() => {
    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)

    loadListedItems()
  }, [loadListedItems])

  if (loading) return (
    <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
      <h2 className="text-center">Loading...</h2>
    </main>
  )

  return (
    <div style={{ backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
      {listedItems.length > 0 ? (
        <div className="container py-5">
          <h2 className="text-white text-center mb-4" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>My Listed NFTs</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="d-flex align-items-stretch">
                <Card style={{ borderRadius: '20px', backgroundColor: '#00509d', color: '#fff' }}>
                  <Card.Img variant="top" src={item.image} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '200px', objectFit: 'cover' }} />
                  <Card.Footer className="bg-transparent border-top-0 p-3">
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0", backgroundColor: "#001f3f", minHeight: "100vh", color: "#fff" }}>
          <h2 className="text-center">No listed assets</h2>
        </main>
      )}
    </div>
  )
}
