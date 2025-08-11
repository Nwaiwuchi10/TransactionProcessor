import React, { useState } from "react";
import axios from "axios";

const CreateCreativeProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    productBenefits: "",
    fileType: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle form text changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads with previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("createDto", JSON.stringify(formData));
      files.forEach((file) => data.append("fileUrl", file));

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk1ZWJlODMyOGU2NDdhYzgwMmQ3YjUiLCJpYXQiOjE3NTQ5MTE3MDYsImV4cCI6MTc1NDk5ODEwNn0.vYwI2BFGbEjfCXzaQ_KlG1WLXU-yZ0M64wVZ0HnYq64";
      //   const token = localStorage.getItem("token"); // Assuming JWT stored here

      const res = await axios.post(
        "https://api.ads.ng/cretive-products", // Your API URL
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product created successfully!");
      console.log(res.data);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Create Creative Product
        </h2>

        {/* Text Inputs */}
        {[
          "title",
          "category",
          "subCategory",
          "fileType",
          "price",
          "productBenefits",
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            className="border rounded-lg w-full p-2 focus:ring focus:ring-indigo-300"
            // required
          />
        ))}

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border rounded-lg w-full p-2 focus:ring focus:ring-indigo-300"
          rows={4}
          required
        ></textarea>

        {/* File Upload */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded-lg"
        />

        {/* Previews */}
        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`preview-${idx}`}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateCreativeProduct;
