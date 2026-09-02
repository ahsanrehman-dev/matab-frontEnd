import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FiUpload, FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import "./ProductForm.css";
import api from "../../utils/api";

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    images: [],
    specifications: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    "Select Category",
    "Hair",
    "Skin Allergy",
    "Burn skin",
    "Body power up",
    "Weight gainer",
    "Heart cleaner",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length + imageFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    const newImageFiles = [...imageFiles, ...validFiles];
    setImageFiles(newImageFiles);

    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));

    setError(null);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (!formData.quantity || formData.quantity < 0) {
      setError("Valid quantity is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert images to base64 for now (in production, use cloud storage)
      const imagePromises = imageFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        brand: formData.brand.trim(),
        images: base64Images,
        specifications: formData.specifications.filter(
          (spec) => spec.key && spec.value
        ),
      };

      await api.post("/admin/products", payload);
      // api.post throws if not ok, so next lines only run on success

      setSuccess(true);
      resetForm();

      // Call the callback function to refresh the product list
      if (onProductAdded) {
        onProductAdded();
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      brand: "",
      images: [],
      specifications: [],
    });
    setImageFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      className="product-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-header">
        <h2>Add New Product</h2>
        <p>Create a new product listing for your customers</p>
      </div>

      {success && (
        <motion.div
          className="success-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiSave /> Product uploaded successfully!
        </motion.div>
      )}

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiX /> {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed product description"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (Rs) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Images</h3>
          <div className="form-group">
            <label htmlFor="images">Upload Images (Max 5)</label>
            <div className="image-upload">
              <input
                ref={fileInputRef}
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
              <label htmlFor="images" className="upload-label">
                <FiUpload /> Choose Images
              </label>
              <p className="upload-hint">Maximum 5 images, 5MB each</p>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="image-preview">
              <h4>Selected Images ({formData.images.length}/5):</h4>
              <div className="image-grid">
                {formData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="image-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      <FiX />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Specifications (Optional)</h3>
          <div className="specifications">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="specification-row">
                <input
                  type="text"
                  placeholder="Specification name"
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecification(index, "key", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecification(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="remove-spec"
                  onClick={() => removeSpecification(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-spec-btn"
              onClick={addSpecification}
            >
              <FiPlus /> Add Specification
            </button>
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            type="submit"
            className="btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Uploading...
              </div>
            ) : (
              <>
                <FiSave /> Upload Product
              </>
            )}
          </motion.button>

          <button type="button" className="btn-secondary" onClick={resetForm}>
            Clear Form
          </button>
        </div>
      </form>
    </motion.div>
  );
};

ProductForm.propTypes = {
  onProductAdded: PropTypes.func,
};

export default ProductForm;
