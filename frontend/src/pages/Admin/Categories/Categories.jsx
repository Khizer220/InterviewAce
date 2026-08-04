import { useEffect, useMemo, useState } from "react";
import {
  FaFolderOpen,
  FaCheckCircle,
  FaBook,
  FaGraduationCap,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import SearchBar from "../../../components/admin/common/SearchBar/SearchBar";
import CategoryModal from "../../../components/admin/categories/CategoryModal/CategoryModal";
import PageHeader from "../../../components/admin/common/PageHeader/PageHeader";
import StatsCard from "../../../components/admin/common/StatsCard/StatsCard";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

import { Toaster, toast } from "react-hot-toast";

import styles from "./Categories.module.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category Deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, data);
        toast.success("Category Updated");
      } else {
        await createCategory(data);
        toast.success("Category Added");
      }

      setOpenModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch {
      toast.error("Operation Failed");
    }
  };

  return (
    <>
  <Toaster position="top-right" />

  <AdminLayout>
    

        <PageHeader
          title="Interview Categories"
          subtitle="Manage interview categories for InterviewAce."
          buttonText="+ Add Category"
          onButtonClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
        />

        <div className={styles.statsGrid}>
          <StatsCard
            title="Total Categories"
            value={categories.length}
            icon={<FaFolderOpen />}
            color="#6C4CF1"
          />

          <StatsCard
            title="Active Categories"
            value={categories.filter((c) => c.status).length}
            icon={<FaCheckCircle />}
            color="#10B981"
          />

          <StatsCard
            title="Beginner"
            value={
              categories.filter(
                (c) => c.difficulty === "Beginner"
              ).length
            }
            icon={<FaBook />}
            color="#F59E0B"
          />

          <StatsCard
            title="Advanced"
            value={
              categories.filter(
                (c) => c.difficulty === "Advanced"
              ).length
            }
            icon={<FaGraduationCap />}
            color="#EF4444"
          />
        </div>

<div className={styles.tableContainer}>

  <div className={styles.tableToolbar}>
    <SearchBar
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search categories..."
    />

    <span className={styles.recordCount}>
      {filteredCategories.length} Categories
    </span>
  </div>

  <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>

                  <td>{category.description}</td>

                  <td>{category.difficulty}</td>

                  <td>
                   <span
  className={styles.badge}
  style={{
    background: category.status ? "#DCFCE7" : "#FEE2E2",
    color: category.status ? "#15803D" : "#DC2626",
  }}
>
  {category.status ? "🟢 Active" : "🔴 Inactive"}
</span>
                  </td>

                  <td className={styles.actions}>
  <button
    className={styles.editBtn}
    onClick={() => {
      setSelectedCategory(category);
      setOpenModal(true);
    }}
    title="Edit Category"
  >
    <FaEdit />
  </button>

  <button
    className={styles.deleteBtn}
    onClick={() => handleDelete(category._id)}
    title="Delete Category"
  >
    <FaTrash />
  </button>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
</div>
        <CategoryModal
          isOpen={openModal}
          initialData={selectedCategory}
          onClose={() => {
            setOpenModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      </AdminLayout>
</>
  );
};

export default Categories;