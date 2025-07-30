import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaArrowLeft, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { ShoppingCart, Search, Filter, X } from 'lucide-react';
import Navbar from "../Component/Navbar";
import { API_BASE_URL } from "../../Config";
import RocketLoader from "../Component/RocketLoader";
import ToasterNotification from "../Component/ToasterNotification";
import SuccessAnimation from "../Component/SuccessAnimation";
import ModernCarousel from "../Component/ModernCarousel";
import LoadingSpinner from "../Component/LoadingSpinner";
import "../App.css";

const Pricelist = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);
  const [minOrderMessage, setMinOrderMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    customer_name: "",
    address: "",
    district: "",
    state: "",
    mobile_number: "",
    email: "",
    customer_type: "User",
  });
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [promocode, setPromocode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [promocodes, setPromocodes] = useState([]);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const debounceTimeout = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price) => {
    const num = Number.parseFloat(price);
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const savedCart = localStorage.getItem("firecracker-cart");
        if (savedCart) setCart(JSON.parse(savedCart));
        const [statesRes, productsRes, promocodesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/locations/states`),
          fetch(`${API_BASE_URL}/api/products`),
          fetch(`${API_BASE_URL}/api/promocodes`),
        ]);
        const [statesData, productsData, promocodesData] = await Promise.all([
          statesRes.json(),
          productsRes.json(),
          promocodesRes.json(),
        ]);
        setStates(Array.isArray(statesData) ? statesData : []);
        // Natural sort function for case-insensitive sorting with numeric handling
        const naturalSort = (a, b) => {
          const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: "base",
          });
          return collator.compare(a.productname, b.productname);
        };
        // Deduplicate and sort products
        const seenSerials = new Set();
        const normalizedProducts = productsData.data
          .filter((p) => {
            if (p.status !== "on") return false;
            if (seenSerials.has(p.serial_number)) {
              console.warn(`Duplicate serial_number found: ${p.serial_number}`);
              return false;
            }
            seenSerials.add(p.serial_number);
            return true;
          })
          .map((product) => ({
            ...product,
            images: product.image
              ? typeof product.image === "string"
                ? JSON.parse(product.image)
                : product.image
              : [],
          }))
          .sort(naturalSort);
        setProducts(normalizedProducts);
        setPromocodes(Array.isArray(promocodesData) ? promocodesData : []);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (customerDetails.state) {
      fetch(`${API_BASE_URL}/api/locations/states/${customerDetails.state}/districts`)
        .then((res) => res.json())
        .then((data) => setDistricts(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [customerDetails.state]);

  useEffect(() => localStorage.setItem("firecracker-cart", JSON.stringify(cart)), [cart]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (promocode && promocode !== "custom") handleApplyPromo(promocode);
      else setAppliedPromo(null);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [promocode]);

  const addToCart = useCallback((product) => {
    if (!product || !product.serial_number) return console.error("Invalid product or missing serial_number:", product);
    setCart((prev) => ({ ...prev, [product.serial_number]: (prev[product.serial_number] || 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((product) => {
    if (!product || !product.serial_number) return console.error("Invalid product or missing serial_number:", product);
    setCart((prev) => {
      const count = (prev[product.serial_number] || 1) - 1;
      const updated = { ...prev };
      if (count <= 0) delete updated[product.serial_number];
      else updated[product.serial_number] = count;
      return updated;
    });
  }, []);

  const updateCartQuantity = useCallback((product, quantity) => {
    if (!product?.serial_number) return console.error("Invalid product or missing serial_number:", product);
    if (quantity < 0) quantity = 0;
    setCart((prev) => {
      const updated = { ...prev };
      if (quantity === 0) delete updated[product.serial_number];
      else updated[product.serial_number] = quantity;
      return updated;
    });
  }, []);

  const handleFinalCheckout = async () => {
    const order_id = `ORD-${Date.now()}`;
    const selectedProducts = Object.entries(cart).map(([serial, qty]) => {
      const product = products.find((p) => p.serial_number === serial);
      return {
        id: product.id,
        product_type: product.product_type,
        quantity: qty,
        per: product.per,
        price: product.price,
        discount: product.discount,
        serial_number: product.serial_number,
        productname: product.productname,
        status: product.status,
      };
    });

    if (!selectedProducts.length) return showError("Your cart is empty.");
    if (!customerDetails.customer_name) return showError("Customer name is required.");
    if (!customerDetails.address) return showError("Address is required.");
    if (!customerDetails.district) return showError("District is required.");
    if (!customerDetails.state) return showError("Please select a state.");
    if (!customerDetails.mobile_number) return showError("Mobile number is required.");

    const mobile = customerDetails.mobile_number.replace(/\D/g, "").slice(-10);
    if (mobile.length !== 10) return showError("Mobile number must be 10 digits.");

    const selectedState = customerDetails.state?.trim();
    const minOrder = states.find((s) => s.name === selectedState)?.min_rate;
    if (minOrder && Number.parseFloat(originalTotal) < minOrder)
      return showError(`Minimum order for ${selectedState} is ₹${minOrder}. Your total is ₹${originalTotal}.`);

    try {
      setShowLoader(true);
      const response = await fetch(`${API_BASE_URL}/api/direct/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id,
          products: selectedProducts,
          net_rate: Number.parseFloat(totals.net),
          you_save: Number.parseFloat(totals.save),
          processing_fee: Number.parseFloat(totals.processing_fee),
          total: Number.parseFloat(totals.total),
          promo_discount: Number.parseFloat(totals.promo_discount || "0.00"),
          customer_type: customerDetails.customer_type,
          customer_name: customerDetails.customer_name,
          address: customerDetails.address,
          mobile_number: mobile,
          email: customerDetails.email,
          district: customerDetails.district,
          state: customerDetails.state,
          promocode: appliedPromo?.code || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const pdfResponse = await fetch(`${API_BASE_URL}/api/direct/invoice/${data.order_id}`, { responseType: "blob" });
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const safeCustomerName = (customerDetails.customer_name || "unknown")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
        link.setAttribute("download", `${safeCustomerName}-${data.order_id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        setShowLoader(false);
        showError(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setShowLoader(false);
      showError("Something went wrong during checkout.");
    }
  };

  const handleRocketComplete = () => {
    setShowLoader(false);
    setIsCartOpen(false);
    setShowModal(false);
    setShowDetailsModal(false);
    setShowMinOrderModal(false);
    setCart({});
    setCustomerDetails({
      customer_name: "",
      address: "",
      district: "",
      state: "",
      mobile_number: "",
      email: "",
      customer_type: "User",
    });
    setAppliedPromo(null);
    setPromocode("");
    setOriginalTotal(0);
    setTotalDiscount(0);
    setTimeout(() => {
      setShowToaster(true);
    }, 500);
  };

  const showError = (message) => {
    setMinOrderMessage(message);
    setShowMinOrderModal(true);
    setTimeout(() => setShowMinOrderModal(false), 5000);
  };

  const handleCheckoutClick = () =>
    Object.keys(cart).length ? (setShowModal(true), setIsCartOpen(false)) : showError("Your cart is empty.");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile_number") {
      const cleaned = value.replace(/\D/g, "").slice(-10);
      setCustomerDetails((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleShowDetails = useCallback((product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  }, []);

  const handleImageClick = useCallback((media) => {
    const mediaItems = Array.isArray(media) ? media : [];
    setSelectedImages(mediaItems);
    setCurrentImageIndex(0);
    setShowImageModal(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  }, []);

  const handleApplyPromo = useCallback(
    async (code) => {
      if (!code) return setAppliedPromo(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/promocodes`);
        const promos = await res.json();
        const found = promos.find((p) => p.code.toLowerCase() === code.toLowerCase());
        if (!found) {
          showError("Invalid promocode.");
          setAppliedPromo(null);
          return;
        }
        if (found.min_amount && Number.parseFloat(originalTotal) < found.min_amount) {
          showError(`Minimum order amount for this promocode is ₹${found.min_amount}. Your total is ₹${originalTotal}.`);
          setAppliedPromo(null);
          return;
        }
        if (found.end_date && new Date(found.end_date) < new Date()) {
          showError("This promocode has expired.");
          setAppliedPromo(null);
          return;
        }
        setAppliedPromo(found);
      } catch (err) {
        console.error("Promo apply error:", err);
        showError("Could not validate promocode.");
        setAppliedPromo(null);
      }
    },
    [originalTotal],
  );

  const totals = useMemo(() => {
    let net = 0,
      save = 0,
      total = 0;
    for (const serial in cart) {
      const qty = cart[serial];
      const product = products.find((p) => p.serial_number === serial);
      if (!product) continue;
      const originalPrice = Number.parseFloat(product.price);
      const discount = originalPrice * (product.discount / 100);
      const priceAfterDiscount = originalPrice - discount;
      net += originalPrice * qty;
      save += discount * qty;
      total += priceAfterDiscount * qty;
    }
    setOriginalTotal(total);
    setTotalDiscount(save);

    let promoDiscount = 0;
    if (appliedPromo) {
      promoDiscount = (total * appliedPromo.discount) / 100;
      total -= promoDiscount;
      save += promoDiscount;
    }

    const processingFee = total * 0.03;
    total += processingFee;

    return {
      net: formatPrice(net),
      save: formatPrice(save),
      total: formatPrice(total),
      promo_discount: formatPrice(promoDiscount),
      processing_fee: formatPrice(processingFee),
    };
  }, [cart, products, appliedPromo]);

  const productTypes = useMemo(
    () => ["All", ...new Set(products.map((p) => (p.product_type || "Others").replace(/_/g, " ")).sort())],
    [products],
  );

  const grouped = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.product_type !== "gift_box_dealers" &&
            (selectedType === "All" || p.product_type === selectedType.replace(/ /g, "_")) &&
            (!searchTerm ||
              p.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.serial_number.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .reduce((acc, p) => {
          const key = p.product_type || "Others";
          acc[key] = acc[key] || [];
          acc[key].push(p);
          return acc;
        }, {}),
    [products, selectedType, searchTerm],
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <ToasterNotification show={showToaster} onClose={() => setShowToaster(false)} />
      <AnimatePresence>
        {showLoader && <RocketLoader onComplete={handleRocketComplete} />}
        {showSuccess && <SuccessAnimation />}
        {showMinOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-96 bg-white/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              className="bg-white border-4 border-black border-dashed p-8 max-w-md mx-4 text-center shadow-2xl transform rotate-1"
            >
              <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-50"></div>
              <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <X className="w-8 h-8 text-white transform -rotate-45" />
              </div>
              <h3 className="text-xl font-black text-black mb-4 transform -rotate-1">Oops!</h3>
              <p className="text-black font-bold mb-6 transform rotate-1">{minOrderMessage}</p>
              <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMinOrderModal(false)}
                className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-6 py-3 transform rotate-2 hover:-rotate-2 transition-all duration-300"
              >
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        {showDetailsModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-black border-dashed shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transform rotate-1"
            >
              <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-black text-black mb-2 transform -rotate-1">{selectedProduct.productname}</h2>
                    <div className="flex items-center gap-2">
                      {selectedProduct.discount > 0 && (
                        <span className="bg-red-500 border-2 border-black text-white text-xs font-bold px-2 py-1 transform rotate-2">
                          {selectedProduct.discount}% OFF
                        </span>
                      )}
                      <span className="text-red-500 font-black text-lg">
                        ₹{formatPrice(selectedProduct.price * (1 - selectedProduct.discount / 100))} /{" "}
                        {selectedProduct.per}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseDetails}
                    className="w-8 h-8 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                  >
                    <X className="w-5 h-5 transform -rotate-45" />
                  </motion.button>
                </div>
                <ModernCarousel media={selectedProduct.images} onImageClick={handleImageClick} />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-black mb-2 transform rotate-1">Description</h3>
                    <p className="text-black font-bold transform -rotate-1">
                      {selectedProduct.description ||
                        "Experience the magic of celebrations with our premium quality fireworks."}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02, rotate: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addToCart(selectedProduct);
                        handleCloseDetails();
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-3 transform rotate-1 hover:-rotate-1 shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, rotate: 1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseDetails}
                      className="px-6 bg-white border-4 border-black text-black font-black py-3 transform -rotate-1 hover:rotate-1 transition-all duration-300"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-4 border-black border-dashed shadow-2xl w-full max-w-2xl mobile:max-w-md mobile:w-[90%] onefifty:max-w-[40%] mx-4 max-h-[90vh] flex flex-col transform rotate-1"
            >
              <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>
              <div className="flex justify-between items-center p-6 border-b-4 border-black border-dashed relative z-10">
                <h3 className="text-xl font-black text-black flex items-center gap-2 transform -rotate-1">
                  <ShoppingCart className="w-5 h-5 text-red-500" />
                  Your Cart
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-5 h-5 transform -rotate-45" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-500 border-4 border-black transform rotate-45 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <ShoppingCart className="w-8 h-8 text-white transform -rotate-45" />
                    </div>
                    <p className="text-black font-bold">Your cart is empty</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([serial, qty]) => {
                    const product = products.find((p) => p.serial_number === serial);
                    if (!product) return null;
                    const discount = (product.price * product.discount) / 100;
                    const priceAfterDiscount = formatPrice(product.price - discount);
                    const imageSrc =
                      (Array.isArray(product.images)
                        ? product.images
                        : []
                      ).filter(
                        (item) =>
                          !item.includes("/video/") && !item.toLowerCase().endsWith(".gif")
                      )[0] || "/placeholder.svg?height=80&width=80";

                    return (
                      <motion.div
                        key={serial}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 bg-white border-4 border-black border-dashed transform rotate-1 hover:-rotate-1 transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={imageSrc || "/placeholder.svg"}
                            alt={product.productname}
                            className="w-20 h-20 object-cover bg-white border-2 border-black transform -rotate-2"
                            onClick={() => handleImageClick(product.images)}
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-black text-black line-clamp-2 transform rotate-1">{product.productname}</p>
                          <p className="text-sm text-red-500 font-black">
                            ₹{priceAfterDiscount} x {qty}
                          </p>
                          <p className="text-xs text-black font-bold">
                            Subtotal: ₹{formatPrice((product.price - discount) * qty)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: -15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(product)}
                            className="w-8 h-8 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                          >
                            <FaMinus className="w-4 h-4 transform -rotate-45" />
                          </motion.button>
                          <span className="text-sm font-black w-8 text-center bg-white border-2 border-black px-2 py-1 transform rotate-2">{qty}</span>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 bg-red-500 border-2 border-black text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                          >
                            <FaPlus className="w-4 h-4 transform -rotate-45" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              <div className="p-6 border-t-4 border-black border-dashed bg-white relative z-10">
                <div className="mb-4 p-3 bg-red-50 border-4 border-red-500 border-dashed transform -rotate-1">
                  <p className="text-xs font-black text-red-800 mb-2 text-center">Minimum Purchase Rates</p>
                  <div className="text-xs text-red-700 overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap font-bold">
                      {states.map((s) => `${s.name}: ₹${s.min_rate}`).join(" • ")}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-black text-black mb-2 transform rotate-1">Promocode</label>
                  <select
                    value={promocode}
                    onChange={(e) => setPromocode(e.target.value)}
                    className="w-full px-3 py-2 border-4 border-black border-dashed text-sm font-bold focus:ring-2 focus:ring-red-400 transition-all duration-300 transform -rotate-1 focus:rotate-0"
                  >
                    <option value="">Select Promocode</option>
                    {promocodes.map((promo) => (
                      <option key={promo.id} value={promo.code}>
                        {promo.code} ({promo.discount}% OFF{promo.min_amount ? `, Min: ₹${promo.min_amount}` : ""}
                        {promo.end_date ? `, Exp: ${new Date(promo.end_date).toLocaleDateString()}` : ""})
                      </option>
                    ))}
                    <option value="custom">Enter custom code</option>
                  </select>
                  {promocode === "custom" && (
                    <input
                      type="text"
                      value={promocode === "custom" ? "" : promocode}
                      onChange={(e) => setPromocode(e.target.value)}
                      placeholder="Enter custom code"
                      className="w-full px-3 py-2 mt-2 border-4 border-black border-dashed text-sm font-bold focus:ring-2 focus:ring-red-400 transition-all duration-300 transform rotate-1 focus:-rotate-1"
                    />
                  )}
                  {appliedPromo && (
                    <p className="text-green-600 text-xs mt-1 font-bold">
                      Applied: {appliedPromo.code} ({appliedPromo.discount}% OFF)
                      {appliedPromo.min_amount && `, Min: ₹${appliedPromo.min_amount}`}
                      {appliedPromo.end_date && `, Expires: ${new Date(appliedPromo.end_date).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <div className="text-sm text-black space-y-2 mb-4 font-bold">
                  <div className="flex justify-between">
                    <span>Net Total:</span>
                    <span>₹{totals.net}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>₹{totals.save}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Promocode ({appliedPromo.code}):</span>
                      <span>-₹{totals.promo_discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-black">
                    <span>Processing Fee:</span>
                    <span>₹{totals.processing_fee}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg text-red-500 pt-2 border-t-4 border-red-500 border-dashed">
                    <span>Total:</span>
                    <span>₹{totals.total}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCart({})}
                    className="flex-1 bg-white border-4 border-black text-black font-black py-3 transform -rotate-1 hover:rotate-1 transition-all duration-300"
                  >
                    Clear Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckoutClick}
                    className="flex-1 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-3 transform rotate-1 hover:-rotate-1 shadow-lg transition-all duration-300"
                  >
                    Checkout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showImageModal && selectedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center backdrop-blur-sm"
            onClick={handleCloseImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {selectedImages[currentImageIndex]?.includes("/video/") ? (
                      <video
                        src={selectedImages[currentImageIndex]}
                        autoPlay
                        muted
                        loop
                        className="w-full max-h-[80vh] object-contain border-4 border-white"
                      />
                    ) : (
                      <img
                        src={
                          selectedImages[currentImageIndex] ||
                          "/placeholder.svg?height=600&width=800&query=firecracker"
                         || "/placeholder.svg"}
                        alt="Product Image"
                        className="w-full max-h-[80vh] object-contain border-4 border-white"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseImageModal}
                  className="absolute top-4 right-4 w-12 h-12 bg-red-500 border-4 border-white text-white transform rotate-45 flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-6 h-6 transform -rotate-45" />
                </motion.button>
                {selectedImages.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === 0 ? selectedImages.length - 1 : prev - 1))
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-black text-black transform rotate-12 flex items-center justify-center transition-all duration-300"
                    >
                      <FaArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === selectedImages.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-4 border-black text-black transform -rotate-12 flex items-center justify-center transition-all duration-300"
                    >
                      <FaArrowRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-4 py-2 text-black text-sm font-black transform rotate-2">
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                )}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto p-2">
                    {selectedImages.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 overflow-hidden border-4 transition-all transform ${
                          index === currentImageIndex ? "border-red-500 rotate-3" : "border-white hover:border-red-300 rotate-1 hover:-rotate-1"
                        }`}
                      >
                        {image?.includes("/video/") ? (
                          <video src={image} className="w-full h-full object-cover" />
                        ) : (
                          <img
                            src={image || "/placeholder.svg?height=64&width=64&query=firecracker"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main 
        className="pt-28 px-4 sm:px-8 max-w-7xl mx-auto"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #00000005 1px, transparent 1px),
            linear-gradient(#00000005 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 mobile:-mt-20"
        >
          <div className="relative flex-1 hundred:pt-34">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
              <Search className="w-3 h-3 text-white transform -rotate-45" />
            </div>
            <input
              type="text"
              placeholder="Search by name or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black border-dashed font-bold focus:ring-2 focus:ring-red-400 focus:border-red-500 shadow-sm transform rotate-1 focus:-rotate-1 transition-all duration-300"
            />
          </div>
          <div className="relative hundred:pt-34">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 border-2 border-black transform rotate-45 flex items-center justify-center">
              <Filter className="w-3 h-3 text-white transform -rotate-45" />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white border-4 border-black border-dashed font-bold focus:ring-2 focus:ring-red-400 focus:border-red-500 shadow-sm appearance-none cursor-pointer min-w-[200px] transform -rotate-1 focus:rotate-1 transition-all duration-300"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {Object.entries(grouped).map(([type, items]) => (
          <motion.div key={type} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-black capitalize transform -rotate-1">{type.replace(/_/g, " ")}</h2>
              <div className="flex-1 h-2 bg-red-500 border-2 border-black transform rotate-1" />
              <span className="text-red-500 font-black bg-white border-4 border-black px-3 py-1 text-sm transform rotate-2">
                {items.length} items
              </span>
            </div>
            <div className="grid mobile:grid-cols-2 hundred:grid-cols-4 onefifty:grid-cols-3 gap-6">
              {items.map((product) => {
                if (!product) return null;
                const originalPrice = Number.parseFloat(product.price);
                const discount = originalPrice * (product.discount / 100);
                const finalPrice =
                  product.discount > 0 ? formatPrice(originalPrice - discount) : formatPrice(originalPrice);
                const count = cart[product.serial_number] || 0;

                return (
                  <motion.div
                    key={product.serial_number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
                    className="group bg-white border-4 border-black border-dashed shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform rotate-1 hover:-rotate-1"
                  >
                    <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>
                    <div className="relative z-10">
                      <ModernCarousel media={product.images} onImageClick={handleImageClick} />
                      {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 border-2 border-black text-white text-sm font-bold px-3 py-1 shadow-lg transform -rotate-3">
                          {product.discount}% OFF
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShowDetails(product)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black transform rotate-12 flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <FaInfoCircle className="text-current" />
                      </motion.button>
                    </div>
                    <div className="p-6 relative z-10">
                      <h3 className="text-lg font-black text-black mb-3 line-clamp-2 group-hover:text-red-500 transform -rotate-1">
                        {product.productname}
                      </h3>
                      <div className="flex items-center gap-3 mb-4">
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through font-bold">₹{formatPrice(originalPrice)}</span>
                        )}
                        <span className="text-xl font-black text-red-500">₹{finalPrice}</span>
                        <span className="text-sm text-black font-bold">/ {product.per}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <AnimatePresence mode="wait">
                          {count > 0 ? (
                            <motion.div
                              key="quantity-controls"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="flex items-center gap-2 sm:gap-3 bg-red-500 border-4 border-black p-1.5 sm:p-2 transform rotate-2"
                            >
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: -15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(product)}
                                className="w-6 h-6 sm:w-8 sm:h-8 bg-white border-2 border-black transform rotate-45 flex items-center justify-center text-black"
                              >
                                <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3 transform -rotate-45" />
                              </motion.button>
                              <span className="text-white font-black text-sm sm:text-lg px-1 sm:px-2 w-10 sm:w-16 text-center">
                                {count}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => addToCart(product)}
                                className="w-6 h-6 sm:w-8 sm:h-8 bg-white border-2 border-black transform rotate-45 flex items-center justify-center text-black"
                              >
                                <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 transform -rotate-45" />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add-button"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.05, rotate: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addToCart(product)}
                              className="bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 shadow-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base transform rotate-1 hover:-rotate-1 transition-all duration-300"
                            >
                              <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Add</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {/* Sketch decorative corners */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-black transform rotate-45"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black transform rotate-45"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 transform rotate-45"></div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
              className="bg-white border-4 border-black border-dashed shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transform rotate-1"
            >
              <div className="absolute inset-2 border-2 border-red-500 border-dotted opacity-30"></div>
              <div className="p-6 relative z-10">
                <h2 className="text-2xl font-black mb-6 text-black transform -rotate-1">Customer Details</h2>
                <div className="space-y-4">
                  {["customer_name", "address", "mobile_number", "email"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={field.replace(/_/g, " ").toUpperCase()}
                      value={customerDetails[field]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-4 border-black border-dashed font-bold focus:ring-2 focus:ring-red-400 focus:border-red-500 transform rotate-1 focus:-rotate-1 transition-all duration-300"
                      required={field !== "email"}
                    />
                  ))}
                  <select
                    name="state"
                    value={customerDetails.state}
                    onChange={(e) => setCustomerDetails((prev) => ({ ...prev, state: e.target.value, district: "" }))}
                    className="w-full px-4 py-3 border-4 border-black border-dashed font-bold focus:ring-2 focus:ring-red-400 focus:border-red-500 transform -rotate-1 focus:rotate-1 transition-all duration-300"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {customerDetails.state && (
                    <select
                      name="district"
                      value={customerDetails.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-4 border-black border-dashed font-bold focus:ring-2 focus:ring-red-400 focus:border-red-500 transform rotate-1 focus:-rotate-1 transition-all duration-300"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <div>
                    <label className="block text-sm font-black text-black mb-2 transform rotate-1">Promocode</label>
                    <select
                      value={promocode}
                      onChange={(e) => setPromocode(e.target.value)}
                      className="w-full px-3 py-2 border-4 border-black border-dashed text-sm font-bold focus:ring-2 focus:ring-red-400 transition-all duration-300 transform -rotate-1 focus:rotate-1"
                    >
                      <option value="">Select Promocode</option>
                      {promocodes.map((promo) => (
                        <option key={promo.id} value={promo.code}>
                          {promo.code} ({promo.discount}% OFF{promo.min_amount ? `, Min: ₹${promo.min_amount}` : ""}
                          {promo.end_date ? `, Exp: ${new Date(promo.end_date).toLocaleDateString()}` : ""})
                        </option>
                      ))}
                      <option value="custom">Enter custom code</option>
                    </select>
                    {promocode === "custom" && (
                      <input
                        type="text"
                        value={promocode === "custom" ? "" : promocode}
                        onChange={(e) => setPromocode(e.target.value)}
                        placeholder="Enter custom code"
                        className="w-full px-3 py-2 mt-2 border-4 border-black border-dashed text-sm font-bold focus:ring-2 focus:ring-red-400 transition-all duration-300 transform rotate-1 focus:-rotate-1"
                      />
                    )}
                    {appliedPromo && (
                      <p className="text-green-600 text-xs mt-1 font-bold">
                        Applied: {appliedPromo.code} ({appliedPromo.discount}% OFF)
                        {appliedPromo.min_amount && `, Min: ₹${appliedPromo.min_amount}`}
                        {appliedPromo.end_date && `, Expires: ${new Date(appliedPromo.end_date).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-black space-y-2 font-bold">
                    <div className="flex justify-between">
                      <span>Net Total:</span>
                      <span>₹{totals.net}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Promocode ({appliedPromo.code}):</span>
                        <span>-₹{totals.promo_discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-green-600">
                      <span>Discount (promocode included):</span>
                      <span>-₹{totals.save}</span>
                    </div>
                    <div className="flex justify-between text-black">
                      <span>Processing Fee:</span>
                      <span>₹{totals.processing_fee}</span>
                    </div>
                    <div className="flex justify-between font-black text-lg text-red-500 pt-2 border-t-4 border-red-500 border-dashed">
                      <span>Total:</span>
                      <span>₹{totals.total}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white border-4 border-black text-black font-black py-3 transform -rotate-1 hover:rotate-1 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinalCheckout}
                    className="flex-1 bg-red-500 hover:bg-red-600 border-4 border-black text-white font-black py-3 transform rotate-1 hover:-rotate-1 shadow-lg transition-all duration-300"
                  >
                    Confirm Booking
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsCartOpen(true)}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 border-4 border-black text-white shadow-2xl w-16 h-16 flex items-center justify-center transform rotate-12 hover:-rotate-12 transition-all duration-300 ${isCartOpen ? "hidden" : ""}`}
      >
        <ShoppingCart className="w-6 h-6" />
        {Object.keys(cart).length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-black border-2 border-white text-red-500 text-xs w-6 h-6 flex items-center justify-center font-black transform -rotate-12"
          >
            {Object.values(cart).reduce((a, b) => a + b, 0)}
          </motion.span>
        )}
      </motion.button>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};

export default Pricelist;