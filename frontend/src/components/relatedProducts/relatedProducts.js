import { useNavigate } from "react-router-dom";
import "./relatedProducts.css"; // import the CSS (you'll define this below)

function RelatedProductsCarousel({ relatedProducts }) {
  const navigate = useNavigate();

  return (
    <div className="related-scroll-container px-3 py-4">
      <div className="related-products-scroll">
        {relatedProducts.map((prod) => (
          <div
            key={prod.productId}
            className="card product-card"
            style={{ width: "180px", cursor: "pointer" }}
            onClick={() => navigate("/product", { state: prod })}
          >
            <img
              src={prod.imageUrls[0]}
              className="card-img-top"
              alt={prod.name}
              style={{ height: "150px", objectFit: "contain" }}
            />
            <div className="card-body">
              <h6 className="card-title">
                {prod.name.split(" ").slice(0, 3).join(" ")}
              </h6>
              <p className="card-text text-muted mb-1">₹{prod.price}</p>
              <span className="badge text-dark">{prod.brand}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RelatedProductsCarousel;
