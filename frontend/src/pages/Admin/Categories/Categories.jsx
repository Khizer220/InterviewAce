import { useEffect, useMemo, useState } from "react";

import {
  FaFolderOpen,
  FaCheckCircle,
  FaBook,
  FaGraduationCap,
  FaEdit,
  FaTrash,
  FaReact,
  FaCode,
  FaDatabase,
  FaServer,
  FaProjectDiagram,
  FaSearch,
  FaClock,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";

import CategoryModal from "../../../components/admin/categories/CategoryModal/CategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

import { Toaster, toast } from "react-hot-toast";

import styles from "./Categories.module.css";


/* =========================================================
   CATEGORY LOGO
========================================================= */

const getCategoryIcon = (category) => {
  const name = category?.name?.toLowerCase().trim() || "";

  const logos = {
    css: "/icons/css.png",
    html: "/icons/html.png",
    java: "/icons/java.png",
    javascript: "/icons/javascript.png",

    "node.js": "/icons/nodejs.png",
    nodejs: "/icons/nodejs.png",

    python: "/icons/python.png",

    react: "/icons/react.png",
    "react js": "/icons/react.png",
    reactjs: "/icons/react.png",

    php: "/icons/php.png",
    mysql: "/icons/mysql.png",

    dbms: "/icons/dbms.png",

    "data structure": "/icons/datastructure.png",
    "data structures": "/icons/datastructure.png",
    dsa: "/icons/datastructure.png",
  };

  const logo = logos[name];

  if (logo) {
    return (
      <img
        src={logo}
        alt={category?.name || "Category"}
      />
    );
  }

  return <FaFolderOpen />;
};


/* =========================================================
   CATEGORIES
========================================================= */

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [sortBy, setSortBy] =
    useState("Newest First");

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);


  /* =======================================================
     FETCH
  ======================================================= */

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load categories");
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);


  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredCategories = useMemo(() => {
    let result = [...categories];

    const query = search.trim().toLowerCase();


    /* SEARCH */

    if (query) {
      result = result.filter((category) => {
        const name =
          category.name?.toLowerCase() || "";

        const description =
          category.description?.toLowerCase() || "";

        return (
          name.includes(query) ||
          description.includes(query)
        );
      });
    }


    /* STATUS */

    if (statusFilter === "Active") {
      result = result.filter(
        (category) => category.status
      );
    }

    if (statusFilter === "Inactive") {
      result = result.filter(
        (category) => !category.status
      );
    }


    /* SORT */

    if (sortBy === "A-Z") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(
          b.name || ""
        )
      );
    }

    if (sortBy === "Z-A") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(
          a.name || ""
        )
      );
    }

    if (sortBy === "Newest First") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sortBy === "Oldest First") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    return result;
  }, [
    categories,
    search,
    statusFilter,
    sortBy,
  ]);


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category?"
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);

      toast.success("Category deleted");

      fetchCategories();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };


  /* =======================================================
     SAVE
  ======================================================= */

  const handleSaveCategory = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(
          selectedCategory._id,
          data
        );

        toast.success("Category updated");
      } else {
        await createCategory(data);

        toast.success("Category added");
      }

      setOpenModal(false);

      setSelectedCategory(null);

      fetchCategories();
    } catch (error) {
      console.error(error);

      toast.error("Operation failed");
    }
  };


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
      <Toaster position="top-right" />

      <AdminLayout>

        <div className={styles["ia-categories-page"]}>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles["ia-page-header"]}>

            <div>

              <h1>
                Categories
              </h1>

              <div className={styles["ia-breadcrumb"]}>
                <span>Dashboard</span>
                <span>›</span>
                <strong>Categories</strong>
              </div>

            </div>


            <button
              type="button"
              className={styles["ia-add-category"]}
              onClick={() => {
                setSelectedCategory(null);
                setOpenModal(true);
              }}
            >
              + Add Category
            </button>

          </div>


          {/* =================================================
              STATS
          ================================================= */}

       {/* =================================================
    STATS
================================================= */}

<div className={styles["ia-stats-grid"]}>

  {/* TOTAL CATEGORIES */}

  <div className={styles["ia-stat-card"]}>

    <div
      className={`${styles["ia-stat-icon"]} ${styles["ia-purple"]}`}
    >
      <FaFolderOpen />
    </div>

    <div className={styles["ia-stat-info"]}>

      <strong>
        {categories.length}
      </strong>

      <span>
        Total Categories
      </span>

    </div>

  </div>


  {/* ACTIVE CATEGORIES */}

  <div className={styles["ia-stat-card"]}>

    <div
      className={`${styles["ia-stat-icon"]} ${styles["ia-green"]}`}
    >
      <FaCheckCircle />
    </div>

    <div className={styles["ia-stat-info"]}>

      <strong>
        {
          categories.filter(
            (category) => category.status
          ).length
        }
      </strong>

      <span>
        Active Categories
      </span>

    </div>

  </div>


  {/* TOTAL QUESTIONS */}

  <div className={styles["ia-stat-card"]}>

    <div
      className={`${styles["ia-stat-icon"]} ${styles["ia-orange"]}`}
    >
      <FaBook />
    </div>

    <div className={styles["ia-stat-info"]}>

      <strong>
        {categories.reduce(
          (total, category) =>
            total +
            Number(
              category.totalQuestions ||
              category.questions?.length ||
              0
            ),
          0
        )}
      </strong>

      <span>
        Total Questions
      </span>

    </div>

  </div>


  {/* TOTAL ATTEMPTS */}

  <div className={styles["ia-stat-card"]}>

    <div
      className={`${styles["ia-stat-icon"]} ${styles["ia-blue"]}`}
    >
      <FaGraduationCap />
    </div>

    <div className={styles["ia-stat-info"]}>

      <strong>
        0
      </strong>

      <span>
        Total Attempts
      </span>

    </div>

  </div>

</div>


          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className={styles["ia-filter-bar"]}>

            {/* SEARCH */}

            <div className={styles["ia-search-box"]}>

              <FaSearch />

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* STATUS */}

            <select
              className={styles["ia-filter-select"]}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option>
                All Status
              </option>

              <option>
                Active
              </option>

              <option>
                Inactive
              </option>
            </select>


            {/* SORT */}

            <select
              className={styles["ia-filter-select"]}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option>
                Newest First
              </option>

              <option>
                Oldest First
              </option>

              <option>
                A-Z
              </option>

              <option>
                Z-A
              </option>
            </select>

          </div>


          {/* =================================================
              CATEGORY GRID
          ================================================= */}

          {filteredCategories.length > 0 ? (

            <div className={styles["ia-category-grid"]}>

              {filteredCategories.map(
                (category) => (

                  <div
                    className={styles["ia-category-card"]}
                    key={category._id}
                  >

                    {/* HEADER */}

                    <div
                      className={
                        styles["ia-category-card-header"]
                      }
                    >

                      <div
                        className={
                          styles["ia-category-icon"]
                        }
                      >
                        {getCategoryIcon(category)}
                      </div>


                      <div
                        className={
                          styles["ia-category-heading"]
                        }
                      >

                        <h3>
                          {category.name}
                        </h3>

                        <p>
                          {category.description ||
                            "No description available."}
                        </p>


                        <span
                          className={
                            category.status
                              ? styles["ia-active-badge"]
                              : styles["ia-inactive-badge"]
                          }
                        >
                          {category.status
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>


                      {/* QUICK ACTIONS */}

                      <div
                        className={
                          styles["ia-card-actions"]
                        }
                      >
<button
  type="button"
  className={styles["ia-edit-button"]}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("EDIT BUTTON CLICKED", category);

    setSelectedCategory(category);
    setOpenModal(true);
  }}
  title="Edit Category"
>
  <FaEdit />
</button>


                        <button
                          type="button"
                          className={
                            styles["ia-delete-button"]
                          }
                          onClick={() =>
                            handleDelete(
                              category._id
                            )
                          }
                          title="Delete"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div
                      className={
                        styles["ia-description"]
                      }
                    >
                      {category.description ||
                        "No description available."}
                    </div>


                    {/* CARD FOOTER */}

                    <div
                      className={
                        styles["ia-card-footer"]
                      }
                    >

                      <div
                        className={
                          styles["ia-footer-column"]
                        }
                      >

                        <span>
                          Questions
                        </span>

                        <strong>
                          {category.totalQuestions ??
                            category.questions?.length ??
                            0}
                        </strong>

                      </div>


                      <div
                        className={
                          styles["ia-footer-column"]
                        }
                      >

                        <span>
                          Duration
                        </span>

                        <strong>
                          <FaClock />

                          {category.duration ||
                            30}{" "}
                          Min
                        </strong>

                      </div>


                      <div
                        className={
                          styles["ia-footer-column"]
                        }
                      >

                        <span>
                          Difficulty
                        </span>

                        <strong
                          className={
                            category.difficulty ===
                            "Advanced"
                              ? styles["ia-difficulty-advanced"]
                              : category.difficulty ===
                                "Intermediate"
                              ? styles["ia-difficulty-intermediate"]
                              : styles["ia-difficulty-beginner"]
                          }
                        >
                          {category.difficulty ||
                            "Beginner"}
                        </strong>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              className={
                styles["ia-empty-state"]
              }
            >

              <FaFolderOpen />

              <h3>
                No categories found
              </h3>

              <p>
                Try another search or add a new
                category.
              </p>

            </div>

          )}

        </div>


        {/* =================================================
            MODAL
        ================================================= */}

        {openModal && (
          <CategoryModal
            category={selectedCategory}
            onClose={() => {
              setOpenModal(false);
              setSelectedCategory(null);
            }}
            onSave={handleSaveCategory}
          />
        )}

      </AdminLayout>
    </>
  );
};

export default Categories;