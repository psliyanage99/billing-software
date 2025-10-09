import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
// import { updateCategory } from "../../Service/CategoryService";
import { assets } from "../../assets/assets";

const EditCategory = ({ show, onClose, category }) => {
  const { categories, setCategories } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    bgColor: "#2c2c2c",
  });

  // Load selected category into the form whenever modal opens
  useEffect(() => {
    if (category) {
      setData({
        name: category.name || "",
        description: category.description || "",
        bgColor: category.bgColor || "#2c2c2c",
      });
      setImage(null);
    }
  }, [category]);

  // Input change handler
  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    try {
      // Use updateCategory service directly
      const response = await updateCategory(category.categoryId, data, image);

      if (response.status === 200) {
        // Update categories list in context
        const updatedList = categories.map((c) =>
          c.categoryId === category.categoryId ? response.data : c
        );
        setCategories(updatedList);
        toast.success("Category updated successfully!");
        onClose();
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error while updating category:", err);
      toast.error("Error updating category.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // Don’t render modal if not visible

  return (
    <div className="modal-overlay">
      <div className="modal-content card p-3">
        <h5>Edit Category</h5>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 text-center">
            <label htmlFor="image" className="form-label">
              <img
                src={image ? URL.createObjectURL(image) : category.imgUrl || assets.upload}
                alt="preview"
                width={80}
                style={{ borderRadius: "8px", cursor: "pointer" }}
              />
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={data.name}
              onChange={onChange}
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="form-control"
              value={data.description}
              onChange={onChange}
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="bgColor" className="form-label">Background Color</label>
            <input
              type="color"
              id="bgColor"
              name="bgColor"
              className="form-control form-control-color"
              value={data.bgColor}
              onChange={onChange}
            />
          </div>

          
          <button type="submit" className="btn btn-warning w-100" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button type="button" className="btn btn-secondary w-100 mt-2" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
